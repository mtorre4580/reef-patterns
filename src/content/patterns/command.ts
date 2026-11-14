import type { Pattern } from '../types';

export const command: Pattern = {
  id: 'command',
  rank: 13,
  name: 'Command',
  localName: { en: 'Command', es: 'Comando', 'pt-BR': 'Comando' },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'Turns an action into an object with everything needed to execute it, undo it or queue it.',
    es: 'Convierte una acción en un objeto con todo lo necesario para ejecutarla, deshacerla o encolarla.',
    'pt-BR':
      'Transforma uma ação em um objeto com tudo o que é preciso para executá-la, desfazê-la ou enfileirá-la.',
  },
  when: {
    en: 'When you need undo/redo, history, task queues, macros or retrying actions later.',
    es: 'Cuando necesitás deshacer/rehacer, un historial, colas de tareas, macros o reintentar acciones más tarde.',
    'pt-BR':
      'Quando você precisa de desfazer/refazer, histórico, filas de tarefas, macros ou repetir ações mais tarde.',
  },
  pros: {
    en: [
      'Undo and redo come almost for free.',
      'Actions can be stored, queued and replayed.',
      'Separates who requests the action from who runs it.',
    ],
    es: [
      'Deshacer y rehacer salen casi gratis.',
      'Las acciones se pueden guardar, encolar y reproducir.',
      'Separa quién pide la acción de quién la ejecuta.',
    ],
    'pt-BR': [
      'Desfazer e refazer saem quase de graça.',
      'As ações podem ser guardadas, enfileiradas e reproduzidas.',
      'Separa quem pede a ação de quem a executa.',
    ],
  },
  cons: {
    en: [
      'A class or object per action adds a lot of code.',
      'Undoing actions with external effects (network) is not always possible.',
    ],
    es: [
      'Una clase o un objeto por acción suma mucho código.',
      'Deshacer acciones con efectos externos (red) no siempre es posible.',
    ],
    'pt-BR': [
      'Uma classe ou objeto por ação soma muito código.',
      'Desfazer ações com efeitos externos (rede) nem sempre é possível.',
    ],
  },
  realWorld: {
    en: 'Undo/redo in editors such as ProseMirror and Monaco, Redux actions, VS Code commands, BullMQ queues.',
    es: 'El undo/redo de editores como ProseMirror y Monaco, las acciones de Redux, los comandos de VS Code, las colas de BullMQ.',
    'pt-BR':
      'O desfazer/refazer de editores como ProseMirror e Monaco, as actions do Redux, os comandos do VS Code, as filas do BullMQ.',
  },
  example: {
    title: {
      en: 'Doser with undo',
      es: 'Dosificadora con deshacer',
      'pt-BR': 'Dosadora com desfazer',
    },
    scenario: {
      en: 'When dosing by hand, a typo can add 50 ml of alkalinity instead of 5. Every dose goes into the history and the last one can be reverted from the log.',
      es: 'Al dosificar a mano, un error de tipeo puede meter 50 ml de alcalinidad en vez de 5. Cada dosis queda en el historial y la última se puede revertir del registro.',
      'pt-BR':
        'Ao dosar manualmente, um erro de digitação pode colocar 50 ml de alcalinidade em vez de 5. Cada dose fica no histórico e a última pode ser revertida do registro.',
    },
    code: `class DoseCommand {
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

const tank = { dosed: {} };
const doser = new DoserConsole();

doser.run(new DoseCommand(tank, 'alk', 5));
doser.run(new DoseCommand(tank, 'alk', 50)); // typo!
doser.undo();
console.log(tank.dosed, doser.history); // { alk: 5 } ['alk 5 ml']`,
  },
  related: ['memento', 'chain-of-responsibility', 'flux', 'strategy'],
};
