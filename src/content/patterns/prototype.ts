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
    title: {
      en: 'Dashboard widget templates',
      es: 'Plantillas de widgets de un dashboard',
      'pt-BR': 'Templates de widgets de um dashboard',
    },
    scenario: {
      en: 'Users add widgets to their dashboard from templates. Each new widget starts as a copy of the template and only changes its title and position.',
      es: 'Los usuarios agregan widgets a su dashboard desde plantillas. Cada widget nuevo arranca como copia de la plantilla y solo cambia el título y la posición.',
      'pt-BR':
        'Os usuários adicionam widgets ao dashboard a partir de templates. Cada widget novo começa como cópia do template e só muda o título e a posição.',
    },
    code: `const revenueChart = {
  type: 'line-chart',
  query: { metric: 'revenue', groupBy: 'day', range: '30d' },
  style: { color: '#1d5b94', showLegend: true },
  title: 'Revenue',
  position: { x: 0, y: 0 },
};

function widgetFrom(template, overrides) {
  // structuredClone copies deeply: each widget gets its own query and style
  return { ...structuredClone(template), ...overrides, id: crypto.randomUUID() };
}

const euRevenue = widgetFrom(revenueChart, { title: 'Revenue · EU', position: { x: 1, y: 0 } });
const usRevenue = widgetFrom(revenueChart, { title: 'Revenue · US', position: { x: 2, y: 0 } });

usRevenue.query.range = '7d'; // does not affect the template or the EU widget
console.log(revenueChart.query.range, euRevenue.query.range, usRevenue.query.range); // 30d 30d 7d

// Native prototypal version: inherits instead of copying
const compact = Object.create(revenueChart, { title: { value: 'Revenue (compact)' } });
console.log(compact.type, compact.title);`,
  },
  related: ['factory-method', 'flyweight', 'memento'],
};
