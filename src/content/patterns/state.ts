import type { Pattern } from '../types';

export const state: Pattern = {
  id: 'state',
  rank: 21,
  name: 'State',
  nameEs: 'Estado',
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary:
    'Un objeto cambia su comportamiento según su estado interno, delegando en un objeto por cada estado.',
  when: 'Cuando un objeto tiene fases con reglas distintas y transiciones válidas entre ellas, y los if por estado se repiten en cada método.',
  pros: [
    'Las transiciones inválidas se vuelven imposibles o explícitas.',
    'Cada estado es pequeño y fácil de leer.',
    'Agregar estados no toca a los existentes.',
  ],
  cons: [
    'Muchas clases o objetos para máquinas simples.',
    'Las transiciones repartidas entre estados pueden ser difíciles de visualizar.',
  ],
  realWorld:
    'XState y las máquinas de estados finitos, el estado de una Promise (pending, fulfilled, rejected), los reducers con un campo status.',
  example: {
    title: 'Computadora de buceo',
    scenario:
      'La computadora pasa por superficie, descenso, fondo, ascenso y parada de seguridad. No se puede salir a la superficie sin hacer la parada.',
    code: `const states = {
  surface: { descend: 'descending' },
  descending: { level: 'bottom', ascend: 'ascending' },
  bottom: { ascend: 'ascending' },
  ascending: { reachStop: 'safetyStop' },
  safetyStop: { complete: 'surface' },
};

class DiveComputer {
  phase = 'surface';
  log = [];

  #go(action) {
    const next = states[this.phase][action];
    if (!next) throw new Error('No se puede "' + action + '" desde ' + this.phase);
    this.log.push(this.phase + ' → ' + next);
    this.phase = next;
  }

  descend() { this.#go('descend'); }
  level() { this.#go('level'); }
  ascend() { this.#go('ascend'); }
  reachStop() { this.#go('reachStop'); }
  complete() { this.#go('complete'); }
}

const computer = new DiveComputer();
computer.descend();
computer.level();
computer.ascend();
try {
  computer.complete(); // salir sin parada de seguridad
} catch (error) {
  console.warn(error.message);
}
computer.reachStop();
computer.complete();
console.log(computer.log);`,
  },
  related: ['strategy', 'memento', 'flux'],
};
