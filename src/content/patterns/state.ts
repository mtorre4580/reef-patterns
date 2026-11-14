import type { Pattern } from '../types';

export const state: Pattern = {
  id: 'state',
  rank: 21,
  name: 'State',
  localName: { en: 'State', es: 'Estado', 'pt-BR': 'Estado' },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'An object changes its behavior based on its internal state, delegating to one object per state.',
    es: 'Un objeto cambia su comportamiento según su estado interno, delegando en un objeto por cada estado.',
    'pt-BR':
      'Um objeto muda seu comportamento conforme seu estado interno, delegando a um objeto por estado.',
  },
  when: {
    en: 'When an object has phases with different rules and valid transitions between them, and per-state ifs repeat in every method.',
    es: 'Cuando un objeto tiene fases con reglas distintas y transiciones válidas entre ellas, y los if por estado se repiten en cada método.',
    'pt-BR':
      'Quando um objeto tem fases com regras diferentes e transições válidas entre elas, e os if por estado se repetem em cada método.',
  },
  pros: {
    en: [
      'Invalid transitions become impossible or explicit.',
      'Each state is small and easy to read.',
      'Adding states does not touch the existing ones.',
    ],
    es: [
      'Las transiciones inválidas se vuelven imposibles o explícitas.',
      'Cada estado es pequeño y fácil de leer.',
      'Agregar estados no toca a los existentes.',
    ],
    'pt-BR': [
      'As transições inválidas ficam impossíveis ou explícitas.',
      'Cada estado é pequeno e fácil de ler.',
      'Adicionar estados não mexe nos existentes.',
    ],
  },
  cons: {
    en: [
      'Many classes or objects for simple machines.',
      'Transitions spread across states can be hard to visualize.',
    ],
    es: [
      'Muchas clases o objetos para máquinas simples.',
      'Las transiciones repartidas entre estados pueden ser difíciles de visualizar.',
    ],
    'pt-BR': [
      'Muitas classes ou objetos para máquinas simples.',
      'Transições espalhadas entre estados podem ser difíceis de visualizar.',
    ],
  },
  realWorld: {
    en: 'XState and finite state machines, the state of a Promise (pending, fulfilled, rejected), reducers with a status field.',
    es: 'XState y las máquinas de estados finitos, el estado de una Promise (pending, fulfilled, rejected), los reducers con un campo status.',
    'pt-BR':
      'XState e as máquinas de estados finitos, o estado de uma Promise (pending, fulfilled, rejected), os reducers com um campo status.',
  },
  example: {
    title: { en: 'Dive computer', es: 'Computadora de buceo', 'pt-BR': 'Computador de mergulho' },
    scenario: {
      en: 'The computer goes through surface, descent, bottom, ascent and safety stop. You cannot surface without doing the stop.',
      es: 'La computadora pasa por superficie, descenso, fondo, ascenso y parada de seguridad. No se puede salir a la superficie sin hacer la parada.',
      'pt-BR':
        'O computador passa por superfície, descida, fundo, subida e parada de segurança. Não é possível subir à superfície sem fazer a parada.',
    },
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
    if (!next) throw new Error('Cannot "' + action + '" from ' + this.phase);
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
  computer.complete(); // surfacing without a safety stop
} catch (error) {
  console.warn(error.message);
}
computer.reachStop();
computer.complete();
console.log(computer.log);`,
  },
  related: ['strategy', 'memento', 'flux'],
};
