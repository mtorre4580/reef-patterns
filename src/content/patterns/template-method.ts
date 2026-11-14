import type { Pattern } from '../types';

export const templateMethod: Pattern = {
  id: 'template-method',
  rank: 20,
  name: 'Template Method',
  nameEs: 'Método plantilla',
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary:
    'Define el esqueleto de un algoritmo en una clase base y deja que las subclases completen ciertos pasos.',
  when: 'Cuando varios procesos comparten la misma secuencia y solo cambian algunos pasos, y querés que la secuencia no se pueda alterar por error.',
  pros: [
    'El orden de los pasos queda fijo en un solo lugar.',
    'Reutiliza el código común entre variantes.',
    'Los hooks opcionales permiten extender sin romper.',
  ],
  cons: [
    'Atado a la herencia: menos flexible que componer estrategias.',
    'Las subclases dependen de detalles de la clase base.',
  ],
  realWorld:
    'Los métodos de ciclo de vida de los componentes de clase de React, los hooks beforeEach/afterEach de los frameworks de tests, los plugins de Rollup.',
  example: {
    title: 'Rutina de cambio de agua',
    scenario:
      'Todo cambio de agua sigue la misma secuencia: apagar equipos, sacar agua, preparar agua nueva, reponer y encender. Un nano y un acuario con sump difieren en algunos pasos.',
    code: `class WaterChange {
  // Método plantilla: la secuencia no cambia
  run() {
    const log = [];
    log.push('Apagar retorno y ATO');
    log.push('Sacar ' + this.volume() + ' L');
    log.push(this.prepareWater());
    if (this.needsSiphon()) log.push('Sifonear la arena');
    log.push('Reponer agua a ' + this.temperature() + ' °C');
    log.push('Encender equipos');
    return log;
  }

  // Paso con valor por defecto (hook)
  needsSiphon() {
    return false;
  }
  temperature() {
    return 25.5;
  }
  volume() {
    throw new Error('Cada acuario define su volumen');
  }
  prepareWater() {
    throw new Error('Cada acuario define cómo prepara el agua');
  }
}

class NanoTank extends WaterChange {
  volume() {
    return 6;
  }
  prepareWater() {
    return 'Usar agua premezclada';
  }
}

class SumpTank extends WaterChange {
  volume() {
    return 40;
  }
  prepareWater() {
    return 'Mezclar sal en el balde de 60 L durante 24 h';
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
