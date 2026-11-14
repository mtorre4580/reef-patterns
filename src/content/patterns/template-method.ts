import type { Pattern } from '../types';

export const templateMethod: Pattern = {
  id: 'template-method',
  rank: 20,
  name: 'Template Method',
  localName: { en: 'Template Method', es: 'Método plantilla', 'pt-BR': 'Método template' },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'Defines the skeleton of an algorithm in a base class and lets subclasses fill in some steps.',
    es: 'Define el esqueleto de un algoritmo en una clase base y deja que las subclases completen ciertos pasos.',
    'pt-BR':
      'Define o esqueleto de um algoritmo em uma classe base e deixa as subclasses completarem certos passos.',
  },
  when: {
    en: 'When several processes share the same sequence and only some steps change, and you want the sequence to be impossible to break by mistake.',
    es: 'Cuando varios procesos comparten la misma secuencia y solo cambian algunos pasos, y querés que la secuencia no se pueda alterar por error.',
    'pt-BR':
      'Quando vários processos compartilham a mesma sequência e só mudam alguns passos, e você quer que a sequência não possa ser alterada por engano.',
  },
  pros: {
    en: [
      'The order of steps is fixed in one place.',
      'Reuses the common code across variants.',
      'Optional hooks allow extension without breaking.',
    ],
    es: [
      'El orden de los pasos queda fijo en un solo lugar.',
      'Reutiliza el código común entre variantes.',
      'Los hooks opcionales permiten extender sin romper.',
    ],
    'pt-BR': [
      'A ordem dos passos fica fixa em um único lugar.',
      'Reutiliza o código comum entre variantes.',
      'Os hooks opcionais permitem estender sem quebrar.',
    ],
  },
  cons: {
    en: [
      'Tied to inheritance: less flexible than composing strategies.',
      'Subclasses depend on details of the base class.',
    ],
    es: [
      'Atado a la herencia: menos flexible que componer estrategias.',
      'Las subclases dependen de detalles de la clase base.',
    ],
    'pt-BR': [
      'Preso à herança: menos flexível que compor estratégias.',
      'As subclasses dependem de detalhes da classe base.',
    ],
  },
  realWorld: {
    en: "Lifecycle methods of React class components, test frameworks' beforeEach/afterEach hooks, Rollup plugins.",
    es: 'Los métodos de ciclo de vida de los componentes de clase de React, los hooks beforeEach/afterEach de los frameworks de tests, los plugins de Rollup.',
    'pt-BR':
      'Os métodos de ciclo de vida dos componentes de classe do React, os hooks beforeEach/afterEach dos frameworks de teste, os plugins do Rollup.',
  },
  example: {
    title: {
      en: 'Water change routine',
      es: 'Rutina de cambio de agua',
      'pt-BR': 'Rotina de troca de água',
    },
    scenario: {
      en: 'Every water change follows the same sequence: turn off equipment, drain water, prepare new water, refill and turn on. A nano tank and a sump tank differ in some steps.',
      es: 'Todo cambio de agua sigue la misma secuencia: apagar equipos, sacar agua, preparar agua nueva, reponer y encender. Un nano y un acuario con sump difieren en algunos pasos.',
      'pt-BR':
        'Toda troca de água segue a mesma sequência: desligar equipamentos, tirar água, preparar água nova, repor e ligar. Um nano e um aquário com sump diferem em alguns passos.',
    },
    code: `class WaterChange {
  // Template method: the sequence never changes
  run() {
    const log = [];
    log.push('Turn off return pump and ATO');
    log.push('Drain ' + this.volume() + ' L');
    log.push(this.prepareWater());
    if (this.needsSiphon()) log.push('Siphon the sand');
    log.push('Refill water at ' + this.temperature() + ' °C');
    log.push('Turn equipment back on');
    return log;
  }

  // Step with a default value (hook)
  needsSiphon() {
    return false;
  }
  temperature() {
    return 25.5;
  }
  volume() {
    throw new Error('Each tank defines its volume');
  }
  prepareWater() {
    throw new Error('Each tank defines how it prepares the water');
  }
}

class NanoTank extends WaterChange {
  volume() {
    return 6;
  }
  prepareWater() {
    return 'Use premixed water';
  }
}

class SumpTank extends WaterChange {
  volume() {
    return 40;
  }
  prepareWater() {
    return 'Mix salt in the 60 L bucket for 24 h';
  }
  needsSiphon() {
    return true;
  }
}

console.log(new NanoTank().run());
console.log(new SumpTank().run());`,
  },
  related: ['strategy', 'hoc'],
};
