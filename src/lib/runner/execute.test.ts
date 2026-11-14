import { executeChallenge } from './execute';

const tests = [
  { name: 'suma', code: 'expect(add(2, 3)).toBe(5);' },
  { name: 'espía', code: 'const spy = fn(); notify(spy); expect(spy).toHaveBeenCalledTimes(1);' },
];

describe('executeChallenge', () => {
  it('reporta éxito y captura la consola', async () => {
    const code = `
      function add(a, b) { console.log('sumando', a, b); return a + b; }
      function notify(cb) { console.warn({ ok: true }); cb(); }
    `;
    const result = await executeChallenge({ code, tests });
    expect(result.results.every((r) => r.passed)).toBe(true);
    expect(result.logs).toEqual([
      { level: 'log', args: ['sumando', '2', '3'] },
      { level: 'warn', args: ['{ ok: true }'] },
    ]);
  });

  it('reporta fallos con el mensaje del assert', async () => {
    const code = 'function add(a, b) { return a - b; } function notify() {}';
    const result = await executeChallenge({ code, tests });
    expect(result.results[0]).toMatchObject({
      passed: false,
      error: 'Se esperaba 5 y se recibió -1',
    });
    expect(result.results[1]?.passed).toBe(false);
  });

  it('reporta excepciones lanzadas por el código', async () => {
    const code =
      'function add() { throw new TypeError("sensor desconectado"); } function notify(cb) { cb(); }';
    const result = await executeChallenge({ code, tests });
    expect(result.results[0]).toMatchObject({ passed: false, error: 'sensor desconectado' });
    expect(result.results[1]?.passed).toBe(true);
  });

  it('marca todos los tests si hay un error de sintaxis', async () => {
    const result = await executeChallenge({ code: 'function add( {', tests });
    expect(result.results.every((r) => !r.passed && r.error?.startsWith('Error de sintaxis'))).toBe(
      true,
    );
  });

  it('soporta tests asíncronos', async () => {
    const code = 'const later = (v) => new Promise((r) => setTimeout(() => r(v), 5));';
    const result = await executeChallenge({
      code,
      tests: [{ name: 'async', code: 'expect(await later(3)).toBe(3);' }],
    });
    expect(result.results[0]?.passed).toBe(true);
  });

  it('incluye los chequeos AST antes de los tests', async () => {
    const result = await executeChallenge({
      code: 'function add(a, b) { switch (a) { default: return a + b; } } function notify(cb) { cb(); }',
      tests,
      checks: [{ rule: 'forbidNode', node: 'SwitchStatement', message: 'Sin switch' }],
    });
    expect(result.results[0]).toMatchObject({ name: 'Sin switch', kind: 'check', passed: false });
    expect(result.results.filter((r) => r.kind === 'test').every((r) => r.passed)).toBe(true);
  });
});
