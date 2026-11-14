import type { Pattern } from '../types';

export const factoryMethod: Pattern = {
  id: 'factory-method',
  rank: 3,
  name: 'Factory Method',
  nameEs: 'Método fábrica',
  category: 'creacional',
  tier: 1,
  gof: true,
  summary:
    'Centraliza la creación de objetos en una función o método que decide qué clase concreta instanciar.',
  when: 'Cuando el código cliente sabe qué necesita (“un coral SPS”) pero no debería saber cómo se construye ni qué clase concreta lo representa.',
  pros: [
    'Un único lugar para agregar tipos nuevos.',
    'El cliente depende de una interfaz, no de clases concretas.',
    'Facilita reemplazar implementaciones en tests.',
  ],
  cons: [
    'Puede convertirse en un switch gigante si no se registra cada tipo por separado.',
    'Agrega una indirección que en casos simples sobra.',
  ],
  realWorld:
    'React.createElement, document.createElement, axios.create, los factories de Vue (createApp) y de Pinia (defineStore).',
  example: {
    title: 'Fábrica de corales',
    scenario:
      'Al cargar un frag nuevo en el inventario, la app crea el coral con sus requisitos de luz (PAR) y flujo según el tipo, sin que la pantalla de carga conozca cada clase.',
    code: `class Coral {
  constructor(name) {
    this.name = name;
  }
  describe() {
    return this.name + ': PAR ' + this.par + ', flujo ' + this.flow;
  }
}

class SpsCoral extends Coral {
  par = '250-400';
  flow = 'alto';
}
class LpsCoral extends Coral {
  par = '100-200';
  flow = 'medio';
}
class SoftCoral extends Coral {
  par = '50-150';
  flow = 'bajo a medio';
}

// Registro en lugar de switch: agregar un tipo es sumar una línea
const coralTypes = { sps: SpsCoral, lps: LpsCoral, soft: SoftCoral };

function createCoral(type, name) {
  const CoralClass = coralTypes[type];
  if (!CoralClass) throw new Error('Tipo de coral desconocido: ' + type);
  return new CoralClass(name);
}

console.log(createCoral('sps', 'Acropora millepora').describe());
console.log(createCoral('soft', 'Zoanthus').describe());`,
  },
  related: ['abstract-factory', 'builder', 'prototype'],
};
