import { runAstChecks } from './ast-checks';

const code = `
class Doser {
  #strategy;
  plan(x) { if (x) return 1; return 2; }
}
const Helper = class { run() {} };
switch (1) { default: }
`;

describe('runAstChecks', () => {
  it('forbidNode detects forbidden nodes', () => {
    const [r] = runAstChecks(code, [
      { rule: 'forbidNode', node: 'SwitchStatement', message: 'No switch' },
    ]);
    expect(r).toMatchObject({ name: 'No switch', passed: false, kind: 'check' });
  });

  it('requireClass accepts declarations and expressions', () => {
    const results = runAstChecks(code, [
      { rule: 'requireClass', name: 'Doser', message: 'Class Doser' },
      { rule: 'requireClass', name: 'Helper', message: 'Class Helper' },
      { rule: 'requireClass', name: 'Nope', message: 'Class Nope' },
    ]);
    expect(results.map((r) => r.passed)).toEqual([true, true, false]);
  });

  it('requireMethod looks for class methods', () => {
    const results = runAstChecks(code, [
      { rule: 'requireMethod', className: 'Doser', method: 'plan', message: 'plan()' },
      { rule: 'requireMethod', className: 'Doser', method: 'undo', message: 'undo()' },
    ]);
    expect(results.map((r) => r.passed)).toEqual([true, false]);
  });

  it('maxIfStatements counts if statements', () => {
    const [ok] = runAstChecks(code, [{ rule: 'maxIfStatements', max: 1, message: 'Max 1 if' }]);
    const [ko] = runAstChecks('if (a) {} if (b) {}', [
      { rule: 'maxIfStatements', max: 1, message: 'Max 1 if' },
    ]);
    expect(ok?.passed).toBe(true);
    expect(ko).toMatchObject({
      passed: false,
      error: 'There are 2 if statements; the maximum is 1',
    });
  });

  it('fails every check when the code does not parse', () => {
    const results = runAstChecks('class {', [{ rule: 'requireClass', name: 'A', message: 'A' }]);
    expect(results[0]?.error).toMatch(/Could not parse/);
  });
});
