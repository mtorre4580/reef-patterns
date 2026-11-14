import type { Pattern } from '../types';

export const command: Pattern = {
  id: 'command',
  rank: 13,
  name: 'Command',
  nameEs: 'Comando',
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary:
    'Convierte una acción en un objeto con todo lo necesario para ejecutarla, deshacerla o encolarla.',
  when: 'Cuando necesitás deshacer/rehacer, un historial, colas de tareas, macros o reintentar acciones más tarde.',
  pros: [
    'Deshacer y rehacer salen casi gratis.',
    'Las acciones se pueden guardar, encolar y reproducir.',
    'Separa quién pide la acción de quién la ejecuta.',
  ],
  cons: [
    'Una clase o un objeto por acción suma mucho código.',
    'Deshacer acciones con efectos externos (red) no siempre es posible.',
  ],
  realWorld:
    'El undo/redo de editores como ProseMirror y Monaco, las acciones de Redux, los comandos de VS Code, las colas de BullMQ.',
  example: {
    title: 'Dosificadora con deshacer',
    scenario:
      'Al dosificar a mano, un error de tipeo puede meter 50 ml de alcalinidad en vez de 5. Cada dosis queda en el historial y la última se puede revertir del registro.',
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
doser.run(new DoseCommand(tank, 'alk', 50)); // ¡error de tipeo!
doser.undo();
console.log(tank.dosed, doser.history); // { alk: 5 } ['alk 5 ml']`,
  },
  related: ['memento', 'chain-of-responsibility', 'flux', 'strategy'],
};
