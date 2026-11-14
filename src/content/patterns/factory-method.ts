import type { Pattern } from '../types';

export const factoryMethod: Pattern = {
  id: 'factory-method',
  rank: 3,
  name: 'Factory Method',
  localName: { en: 'Factory Method', es: 'Método fábrica', 'pt-BR': 'Método fábrica' },
  category: 'creacional',
  tier: 1,
  gof: true,
  summary: {
    en: 'Centralizes object creation in a function or method that decides which concrete class to instantiate.',
    es: 'Centraliza la creación de objetos en una función o método que decide qué clase concreta instanciar.',
    'pt-BR':
      'Centraliza a criação de objetos em uma função ou método que decide qual classe concreta instanciar.',
  },
  when: {
    en: 'When client code knows what it needs ("an SPS coral") but should not know how it is built or which concrete class represents it.',
    es: 'Cuando el código cliente sabe qué necesita (“un coral SPS”) pero no debería saber cómo se construye ni qué clase concreta lo representa.',
    'pt-BR':
      'Quando o código cliente sabe do que precisa ("um coral SPS"), mas não deveria saber como ele é construído nem qual classe concreta o representa.',
  },
  pros: {
    en: [
      'A single place to add new types.',
      'The client depends on an interface, not on concrete classes.',
      'Makes it easy to swap implementations in tests.',
    ],
    es: [
      'Un único lugar para agregar tipos nuevos.',
      'El cliente depende de una interfaz, no de clases concretas.',
      'Facilita reemplazar implementaciones en tests.',
    ],
    'pt-BR': [
      'Um único lugar para adicionar tipos novos.',
      'O cliente depende de uma interface, não de classes concretas.',
      'Facilita trocar implementações nos testes.',
    ],
  },
  cons: {
    en: [
      'It can turn into a giant switch unless each type is registered separately.',
      'Adds an indirection that is overkill in simple cases.',
    ],
    es: [
      'Puede convertirse en un switch gigante si no se registra cada tipo por separado.',
      'Agrega una indirección que en casos simples sobra.',
    ],
    'pt-BR': [
      'Pode virar um switch gigante se cada tipo não for registrado separadamente.',
      'Adiciona uma indireção que sobra em casos simples.',
    ],
  },
  realWorld: {
    en: "React.createElement, document.createElement, axios.create, Vue's createApp and Pinia's defineStore factories.",
    es: 'React.createElement, document.createElement, axios.create, los factories de Vue (createApp) y de Pinia (defineStore).',
    'pt-BR':
      'React.createElement, document.createElement, axios.create, as factories do Vue (createApp) e do Pinia (defineStore).',
  },
  example: {
    title: { en: 'Coral factory', es: 'Fábrica de corales', 'pt-BR': 'Fábrica de corais' },
    scenario: {
      en: 'When a new frag is added to the inventory, the app creates the coral with its light (PAR) and flow requirements based on its type, without the upload screen knowing each class.',
      es: 'Al cargar un frag nuevo en el inventario, la app crea el coral con sus requisitos de luz (PAR) y flujo según el tipo, sin que la pantalla de carga conozca cada clase.',
      'pt-BR':
        'Ao cadastrar um frag novo no inventário, o app cria o coral com seus requisitos de luz (PAR) e fluxo conforme o tipo, sem que a tela de cadastro conheça cada classe.',
    },
    code: `class Coral {
  constructor(name) {
    this.name = name;
  }
  describe() {
    return this.name + ': PAR ' + this.par + ', flow ' + this.flow;
  }
}

class SpsCoral extends Coral {
  par = '250-400';
  flow = 'high';
}
class LpsCoral extends Coral {
  par = '100-200';
  flow = 'medium';
}
class SoftCoral extends Coral {
  par = '50-150';
  flow = 'low to medium';
}

// A registry instead of a switch: adding a type is one more line
const coralTypes = { sps: SpsCoral, lps: LpsCoral, soft: SoftCoral };

function createCoral(type, name) {
  const CoralClass = coralTypes[type];
  if (!CoralClass) throw new Error('Unknown coral type: ' + type);
  return new CoralClass(name);
}

console.log(createCoral('sps', 'Acropora millepora').describe());
console.log(createCoral('soft', 'Zoanthus').describe());`,
  },
  related: ['abstract-factory', 'builder', 'prototype'],
};
