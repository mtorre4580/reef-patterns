import type { Challenge } from '../../types';

export const command1: Challenge = {
  id: 'command-1',
  patternId: 'command',
  title: 'Dosificadora con deshacer',
  difficulty: 'media',
  story:
    'Al dosificar a mano desde el panel, un error de tipeo metió 50 ml de alcalinidad en vez de 5. Queremos un historial de dosis y poder deshacer las últimas del registro.',
  instructions:
    'Implementá:\n' +
    '- `DoseCommand(tank, element, ml)` con `execute()` (suma `ml` a `tank.dosed[element]`) y `undo()` (lo resta).\n' +
    '- `DoserConsole` con `run(command)` (ejecuta y guarda), `undo()` (deshace el último; sin historial no hace nada) y `get history`, que devuelve `["<element> <ml> ml", …]`.',
  starterCode: `class DoserConsole {
  constructor(tank) {
    this.tank = tank;
  }

  dose(element, ml) {
    this.tank.dosed[element] = (this.tank.dosed[element] ?? 0) + ml;
  }
}
`,
  tests: [
    {
      name: 'ejecuta dosis y las registra',
      code: `const tank = { dosed: {} };
const doser = new DoserConsole();
doser.run(new DoseCommand(tank, 'alk', 5));
doser.run(new DoseCommand(tank, 'calcio', 8));
expect(tank.dosed).toEqual({ alk: 5, calcio: 8 });
expect(doser.history).toEqual(['alk 5 ml', 'calcio 8 ml']);`,
    },
    {
      name: 'deshace dos dosis y deja el total correcto',
      code: `const tank = { dosed: {} };
const doser = new DoserConsole();
doser.run(new DoseCommand(tank, 'alk', 5));
doser.run(new DoseCommand(tank, 'alk', 50));
doser.run(new DoseCommand(tank, 'calcio', 10));
doser.undo();
doser.undo();
expect(tank.dosed).toEqual({ alk: 5, calcio: 0 });
expect(doser.history).toEqual(['alk 5 ml']);`,
    },
    {
      name: 'deshacer sin historial no hace nada',
      code: `const doser = new DoserConsole();
doser.undo();
expect(doser.history).toEqual([]);`,
    },
    {
      name: 'funciona con cualquier comando',
      code: `const execute = fn();
const undo = fn();
const doser = new DoserConsole();
doser.run({ execute, undo, element: 'test', ml: 1 });
doser.undo();
expect(execute).toHaveBeenCalledTimes(1);
expect(undo).toHaveBeenCalledTimes(1);`,
    },
  ],
  checks: [
    {
      rule: 'requireMethod',
      className: 'DoseCommand',
      method: 'undo',
      message: 'DoseCommand sabe deshacerse',
    },
  ],
  hints: [
    'Cada comando guarda todo lo necesario para ejecutarse y revertirse: tanque, elemento y ml.',
    '`DoserConsole` solo mantiene una pila: `push` al ejecutar, `pop()?.undo()` al deshacer.',
  ],
  solution: `class DoseCommand {
  constructor(tank, element, ml) {
    this.tank = tank;
    this.element = element;
    this.ml = ml;
  }
  execute() {
    this.tank.dosed[this.element] = (this.tank.dosed[this.element] ?? 0) + this.ml;
  }
  undo() {
    this.tank.dosed[this.element] -= this.ml;
  }
}

class DoserConsole {
  #history = [];

  run(command) {
    command.execute();
    this.#history.push(command);
  }

  undo() {
    this.#history.pop()?.undo();
  }

  get history() {
    return this.#history.map((c) => c.element + ' ' + c.ml + ' ml');
  }
}
`,
};
