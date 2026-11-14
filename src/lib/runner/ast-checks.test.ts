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
  it('forbidNode detecta nodos prohibidos', () => {
    const [r] = runAstChecks(code, [
      { rule: 'forbidNode', node: 'SwitchStatement', message: 'Sin switch' },
    ]);
    expect(r).toMatchObject({ name: 'Sin switch', passed: false, kind: 'check' });
  });

  it('requireClass acepta declaraciones y expresiones', () => {
    const results = runAstChecks(code, [
      { rule: 'requireClass', name: 'Doser', message: 'Clase Doser' },
      { rule: 'requireClass', name: 'Helper', message: 'Clase Helper' },
      { rule: 'requireClass', name: 'Nope', message: 'Clase Nope' },
    ]);
    expect(results.map((r) => r.passed)).toEqual([true, true, false]);
  });

  it('requireMethod busca métodos de la clase', () => {
    const results = runAstChecks(code, [
      { rule: 'requireMethod', className: 'Doser', method: 'plan', message: 'plan()' },
      { rule: 'requireMethod', className: 'Doser', method: 'undo', message: 'undo()' },
    ]);
    expect(results.map((r) => r.passed)).toEqual([true, false]);
  });

  it('maxIfStatements cuenta los if', () => {
    const [ok] = runAstChecks(code, [{ rule: 'maxIfStatements', max: 1, message: 'Máx. 1 if' }]);
    const [ko] = runAstChecks('if (a) {} if (b) {}', [
      { rule: 'maxIfStatements', max: 1, message: 'Máx. 1 if' },
    ]);
    expect(ok?.passed).toBe(true);
    expect(ko).toMatchObject({ passed: false, error: 'Hay 2 if; el máximo es 1' });
  });

  it('marca todos los chequeos como fallidos si el código no parsea', () => {
    const results = runAstChecks('class {', [{ rule: 'requireClass', name: 'A', message: 'A' }]);
    expect(results[0]?.error).toMatch(/No se pudo analizar/);
  });
});
