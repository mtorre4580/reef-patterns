import type { Challenge } from '../../types';

export const command1: Challenge = {
  id: 'command-1',
  patternId: 'command',
  title: {
    en: 'Doser with undo',
    es: 'Dosificadora con deshacer',
    'pt-BR': 'Dosadora com desfazer',
  },
  difficulty: 'media',
  story: {
    en: 'When dosing by hand from the panel, a typo added 50 ml of alkalinity instead of 5. We want a dose history and the ability to undo the latest entries.',
    es: 'Al dosificar a mano desde el panel, un error de tipeo metió 50 ml de alcalinidad en vez de 5. Queremos un historial de dosis y poder deshacer las últimas del registro.',
    'pt-BR':
      'Ao dosar manualmente pelo painel, um erro de digitação colocou 50 ml de alcalinidade em vez de 5. Queremos um histórico de doses e poder desfazer as últimas.',
  },
  instructions: {
    en: 'Implement:\n- `DoseCommand(tank, element, ml)` with `execute()` (adds `ml` to `tank.dosed[element]`) and `undo()` (subtracts it).\n- `DoserConsole` with `run(command)` (executes and stores it), `undo()` (undoes the last one; with no history it does nothing) and `get history`, which returns `["<element> <ml> ml", …]`.',
    es: 'Implementá:\n- `DoseCommand(tank, element, ml)` con `execute()` (suma `ml` a `tank.dosed[element]`) y `undo()` (lo resta).\n- `DoserConsole` con `run(command)` (ejecuta y guarda), `undo()` (deshace el último; sin historial no hace nada) y `get history`, que devuelve `["<element> <ml> ml", …]`.',
    'pt-BR':
      'Implemente:\n- `DoseCommand(tank, element, ml)` com `execute()` (soma `ml` a `tank.dosed[element]`) e `undo()` (subtrai).\n- `DoserConsole` com `run(command)` (executa e guarda), `undo()` (desfaz o último; sem histórico não faz nada) e `get history`, que devolve `["<element> <ml> ml", …]`.',
  },
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
      name: {
        en: 'runs doses and records them',
        es: 'ejecuta dosis y las registra',
        'pt-BR': 'executa doses e as registra',
      },
      code: `const tank = { dosed: {} };
const doser = new DoserConsole();
doser.run(new DoseCommand(tank, 'alk', 5));
doser.run(new DoseCommand(tank, 'calcium', 8));
expect(tank.dosed).toEqual({ alk: 5, calcium: 8 });
expect(doser.history).toEqual(['alk 5 ml', 'calcium 8 ml']);`,
    },
    {
      name: {
        en: 'undoes two doses and leaves the right total',
        es: 'deshace dos dosis y deja el total correcto',
        'pt-BR': 'desfaz duas doses e deixa o total correto',
      },
      code: `const tank = { dosed: {} };
const doser = new DoserConsole();
doser.run(new DoseCommand(tank, 'alk', 5));
doser.run(new DoseCommand(tank, 'alk', 50));
doser.run(new DoseCommand(tank, 'calcium', 10));
doser.undo();
doser.undo();
expect(tank.dosed).toEqual({ alk: 5, calcium: 0 });
expect(doser.history).toEqual(['alk 5 ml']);`,
    },
    {
      name: {
        en: 'undo with no history does nothing',
        es: 'deshacer sin historial no hace nada',
        'pt-BR': 'desfazer sem histórico não faz nada',
      },
      code: `const doser = new DoserConsole();
doser.undo();
expect(doser.history).toEqual([]);`,
    },
    {
      name: {
        en: 'works with any command',
        es: 'funciona con cualquier comando',
        'pt-BR': 'funciona com qualquer comando',
      },
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
      message: {
        en: 'DoseCommand knows how to undo itself',
        es: 'DoseCommand sabe deshacerse',
        'pt-BR': 'DoseCommand sabe se desfazer',
      },
    },
  ],
  hints: {
    en: [
      'Each command stores everything it needs to run and revert: tank, element and ml.',
      '`DoserConsole` just keeps a stack: `push` on run, `pop()?.undo()` on undo.',
    ],
    es: [
      'Cada comando guarda todo lo necesario para ejecutarse y revertirse: tanque, elemento y ml.',
      '`DoserConsole` solo mantiene una pila: `push` al ejecutar, `pop()?.undo()` al deshacer.',
    ],
    'pt-BR': [
      'Cada comando guarda tudo o que precisa para executar e reverter: aquário, elemento e ml.',
      '`DoserConsole` só mantém uma pilha: `push` ao executar, `pop()?.undo()` ao desfazer.',
    ],
  },
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
