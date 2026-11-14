import type { Pattern } from '../types';

export const prototype: Pattern = {
  id: 'prototype',
  rank: 33,
  name: 'Prototype',
  localName: { en: 'Prototype', es: 'Prototipo', 'pt-BR': 'Protótipo' },
  category: 'creacional',
  tier: 3,
  gof: true,
  summary: {
    en: 'Creates new objects by copying an existing one that acts as a model, instead of building them from scratch.',
    es: 'Crea objetos nuevos copiando uno existente que sirve de modelo, en lugar de construirlos desde cero.',
    'pt-BR':
      'Cria objetos novos copiando um existente que serve de modelo, em vez de construí-los do zero.',
  },
  when: {
    en: 'When building an object is expensive or heavily configured, and most new instances are variations of a base.',
    es: 'Cuando construir un objeto es costoso o tiene mucha configuración, y la mayoría de las instancias nuevas son variaciones de una base.',
    'pt-BR':
      'Quando construir um objeto é caro ou tem muita configuração e a maioria das instâncias novas são variações de uma base.',
  },
  pros: {
    en: [
      'Avoids repeating long configurations.',
      'Creates variants without subclasses.',
      'Native to JavaScript: inheritance is prototypal.',
    ],
    es: [
      'Evita repetir configuraciones largas.',
      'Crea variantes sin subclases.',
      'En JavaScript es nativo: la herencia es prototípica.',
    ],
    'pt-BR': [
      'Evita repetir configurações longas.',
      'Cria variantes sem subclasses.',
      'Em JavaScript é nativo: a herança é prototípica.',
    ],
  },
  cons: {
    en: [
      'Shallow copies share nested objects by accident.',
      'Cloning objects with circular references or functions needs care.',
    ],
    es: [
      'Copias superficiales comparten objetos anidados por accidente.',
      'Clonar objetos con referencias circulares o funciones requiere cuidado.',
    ],
    'pt-BR': [
      'Cópias rasas compartilham objetos aninhados por acidente.',
      'Clonar objetos com referências circulares ou funções exige cuidado.',
    ],
  },
  realWorld: {
    en: 'Object.create, structuredClone, the JS prototype chain, duplicable templates in Figma or Notion.',
    es: 'Object.create, structuredClone, la cadena de prototipos de JS, las plantillas duplicables de Figma o Notion.',
    'pt-BR':
      'Object.create, structuredClone, a cadeia de protótipos do JS, os templates duplicáveis do Figma ou do Notion.',
  },
  example: {
    title: { en: 'Frag template', es: 'Plantilla de frag', 'pt-BR': 'Modelo de frag' },
    scenario: {
      en: 'When fragging a colony, each frag inherits species, requirements and origin, and only size and location change. The mother colony is cloned instead of re-entering everything.',
      es: 'Al fraguear una colonia, cada frag hereda especie, requisitos y origen, y solo cambia el tamaño y la ubicación. Se clona el frag madre en vez de cargar todo de nuevo.',
      'pt-BR':
        'Ao fraguear uma colônia, cada frag herda espécie, requisitos e origem, e só mudam o tamanho e o local. Clona-se a colônia mãe em vez de cadastrar tudo de novo.',
    },
    code: `const motherColony = {
  species: 'Acropora tenuis',
  type: 'sps',
  care: { par: [250, 350], flow: 'high', temperature: [24.5, 26.5] },
  origin: 'Local aquaculture',
  sizeCm: 20,
  location: 'Main rock',
};

function fragFrom(prototype, overrides) {
  // structuredClone copies deeply: each frag gets its own care object
  return { ...structuredClone(prototype), ...overrides, parent: prototype.species };
}

const frag1 = fragFrom(motherColony, { sizeCm: 3, location: 'Frag rack A1' });
const frag2 = fragFrom(motherColony, { sizeCm: 2.5, location: 'Frag rack A2' });

frag2.care.flow = 'medium'; // does not affect the mother colony or frag1
console.log(motherColony.care.flow, frag1.care.flow, frag2.care.flow); // high high medium

// Native prototypal version: inherits instead of copying
const lazyFrag = Object.create(motherColony, { sizeCm: { value: 4 } });
console.log(lazyFrag.species, lazyFrag.sizeCm);`,
  },
  related: ['factory-method', 'flyweight', 'memento'],
};
