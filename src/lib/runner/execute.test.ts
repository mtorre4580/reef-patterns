import { executeChallenge } from './execute';

const tests = [
  { name: 'sum', code: 'expect(add(2, 3)).toBe(5);' },
  { name: 'spy', code: 'const spy = fn(); notify(spy); expect(spy).toHaveBeenCalledTimes(1);' },
];

describe('executeChallenge', () => {
  it('reports success and captures the console', async () => {
    const code = `
      function add(a, b) { console.log('adding', a, b); return a + b; }
      function notify(cb) { console.warn({ ok: true }); cb(); }
    `;
    const result = await executeChallenge({ code, tests });
    expect(result.results.every((r) => r.passed)).toBe(true);
    expect(result.logs).toEqual([
      { level: 'log', args: ['adding', '2', '3'] },
      { level: 'warn', args: ['{ ok: true }'] },
    ]);
  });

  it('reports failures with the assertion message', async () => {
    const code = 'function add(a, b) { return a - b; } function notify() {}';
    const result = await executeChallenge({ code, tests });
    expect(result.results[0]).toMatchObject({
      passed: false,
      error: 'Expected 5 but received -1',
    });
    expect(result.results[1]?.passed).toBe(false);
  });

  it('reports exceptions thrown by the code', async () => {
    const code =
      'function add() { throw new TypeError("sensor disconnected"); } function notify(cb) { cb(); }';
    const result = await executeChallenge({ code, tests });
    expect(result.results[0]).toMatchObject({ passed: false, error: 'sensor disconnected' });
    expect(result.results[1]?.passed).toBe(true);
  });

  it('fails every test on a syntax error', async () => {
    const result = await executeChallenge({ code: 'function add( {', tests });
    expect(result.results.every((r) => !r.passed && r.error?.startsWith('Syntax error'))).toBe(
      true,
    );
  });

  it('supports async tests', async () => {
    const code = 'const later = (v) => new Promise((r) => setTimeout(() => r(v), 5));';
    const result = await executeChallenge({
      code,
      tests: [{ name: 'async', code: 'expect(await later(3)).toBe(3);' }],
    });
    expect(result.results[0]?.passed).toBe(true);
  });

  it('includes AST checks before the tests', async () => {
    const result = await executeChallenge({
      code: 'function add(a, b) { switch (a) { default: return a + b; } } function notify(cb) { cb(); }',
      tests,
      checks: [{ rule: 'forbidNode', node: 'SwitchStatement', message: 'No switch' }],
    });
    expect(result.results[0]).toMatchObject({ name: 'No switch', kind: 'check', passed: false });
    expect(result.results.filter((r) => r.kind === 'test').every((r) => r.passed)).toBe(true);
  });
});

describe('localized runner messages', () => {
  it('uses the request locale for assertion messages', async () => {
    const code = 'function add(a, b) { return a - b; } function notify() {}';
    const es = await executeChallenge({ code, tests, locale: 'es' });
    const pt = await executeChallenge({ code, tests, locale: 'pt-BR' });
    expect(es.results[0]?.error).toBe('Se esperaba 5 y se recibió -1');
    expect(pt.results[0]?.error).toBe('Esperava 5, mas recebeu -1');
  });
});
