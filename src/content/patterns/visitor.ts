import type { Pattern } from '../types';

export const visitor: Pattern = {
  id: 'visitor',
  rank: 43,
  name: 'Visitor',
  localName: { en: 'Visitor', es: 'Visitante', 'pt-BR': 'Visitante' },
  category: 'comportamiento',
  tier: 4,
  gof: true,
  summary: {
    en: 'Separates an operation from the object structure it works on, so new operations can be added without touching those objects.',
    es: 'Separa una operación de la estructura de objetos sobre la que opera, para agregar operaciones nuevas sin tocar esos objetos.',
    'pt-BR':
      'Separa uma operação da estrutura de objetos sobre a qual ela opera, para adicionar operações novas sem mexer nesses objetos.',
  },
  when: {
    en: 'When the structure (an AST, a node tree) is stable but you often add different operations to it: export, validate, compute costs.',
    es: 'Cuando la estructura (un AST, un árbol de nodos) es estable pero le agregás operaciones distintas seguido: exportar, validar, calcular costos.',
    'pt-BR':
      'Quando a estrutura (uma AST, uma árvore de nós) é estável, mas você adiciona operações diferentes com frequência: exportar, validar, calcular custos.',
  },
  pros: {
    en: [
      'Adding operations does not modify the nodes.',
      'Each operation is grouped in a single object.',
    ],
    es: [
      'Agregar operaciones no modifica los nodos.',
      'Cada operación queda agrupada en un solo objeto.',
    ],
    'pt-BR': [
      'Adicionar operações não modifica os nós.',
      'Cada operação fica agrupada em um único objeto.',
    ],
  },
  cons: {
    en: [
      'Adding a node type forces you to update every visitor.',
      'Partially breaks node encapsulation.',
    ],
    es: [
      'Agregar un tipo de nodo obliga a actualizar todos los visitantes.',
      'Rompe parcialmente el encapsulamiento de los nodos.',
    ],
    'pt-BR': [
      'Adicionar um tipo de nó obriga a atualizar todos os visitantes.',
      'Quebra parcialmente o encapsulamento dos nós.',
    ],
  },
  realWorld: {
    en: 'Babel and ESLint visitors, acorn-walk, TypeScript transformers, Markdown renderers such as remark.',
    es: 'Los visitors de Babel y ESLint, acorn-walk, los transformadores de TypeScript, los renderers de Markdown como remark.',
    'pt-BR':
      'Os visitors do Babel e do ESLint, acorn-walk, os transformers do TypeScript, os renderizadores de Markdown como o remark.',
  },
  example: {
    title: {
      en: 'Equipment costs and power use',
      es: 'Costos y consumo del equipamiento',
      'pt-BR': 'Custos e consumo do equipamento',
    },
    scenario: {
      en: "The inventory has pumps, lamps and heaters. One visitor computes monthly power consumption; another, replacement cost. The equipment doesn't change.",
      es: 'El inventario tiene bombas, lámparas y calentadores. Un visitante calcula el consumo eléctrico mensual; otro, el costo de reposición. Los equipos no cambian.',
      'pt-BR':
        'O inventário tem bombas, luminárias e aquecedores. Um visitante calcula o consumo elétrico mensal; outro, o custo de reposição. Os equipamentos não mudam.',
    },
    code: `const equipment = [
  { kind: 'pump', name: 'Return pump', watts: 35, price: 180 },
  { kind: 'light', name: 'LED 120 W', watts: 120, hoursPerDay: 9, price: 450 },
  { kind: 'heater', name: 'Heater', watts: 200, dutyCycle: 0.25, price: 40 },
];

// Each visitor defines what to do with each node type
const monthlyKwh = {
  pump: (e) => (e.watts * 24 * 30) / 1000,
  light: (e) => (e.watts * e.hoursPerDay * 30) / 1000,
  heater: (e) => (e.watts * 24 * e.dutyCycle * 30) / 1000,
};

const replacementCost = {
  pump: (e) => e.price,
  light: (e) => e.price * 0.3, // only the LEDs are replaced
  heater: (e) => e.price,
};

function visit(nodes, visitor) {
  return nodes.reduce((total, node) => total + visitor[node.kind](node), 0);
}

console.log('kWh/month:', visit(equipment, monthlyKwh)); // 25.2 + 32.4 + 36 = 93.6
console.log('Replacement:', visit(equipment, replacementCost)); // 355`,
  },
  related: ['composite', 'iterator', 'interpreter'],
};
