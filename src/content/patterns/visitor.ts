import type { Pattern } from '../types';

export const visitor: Pattern = {
  id: 'visitor',
  rank: 43,
  name: 'Visitor',
  nameEs: 'Visitante',
  category: 'comportamiento',
  tier: 4,
  gof: true,
  summary:
    'Separa una operación de la estructura de objetos sobre la que opera, para agregar operaciones nuevas sin tocar esos objetos.',
  when: 'Cuando la estructura (un AST, un árbol de nodos) es estable pero le agregás operaciones distintas seguido: exportar, validar, calcular costos.',
  pros: [
    'Agregar operaciones no modifica los nodos.',
    'Cada operación queda agrupada en un solo objeto.',
  ],
  cons: [
    'Agregar un tipo de nodo obliga a actualizar todos los visitantes.',
    'Rompe parcialmente el encapsulamiento de los nodos.',
  ],
  realWorld:
    'Los visitors de Babel y ESLint, acorn-walk, los transformadores de TypeScript, los renderers de Markdown como remark.',
  example: {
    title: 'Costos y consumo del equipamiento',
    scenario:
      'El inventario tiene bombas, lámparas y calentadores. Un visitante calcula el consumo eléctrico mensual; otro, el costo de reposición. Los equipos no cambian.',
    code: `const equipment = [
  { kind: 'pump', name: 'Retorno', watts: 35, price: 180 },
  { kind: 'light', name: 'LED 120 W', watts: 120, hoursPerDay: 9, price: 450 },
  { kind: 'heater', name: 'Calentador', watts: 200, dutyCycle: 0.25, price: 40 },
];

// Cada visitante define qué hacer con cada tipo de nodo
const monthlyKwh = {
  pump: (e) => (e.watts * 24 * 30) / 1000,
  light: (e) => (e.watts * e.hoursPerDay * 30) / 1000,
  heater: (e) => (e.watts * 24 * e.dutyCycle * 30) / 1000,
};

const replacementCost = {
  pump: (e) => e.price,
  light: (e) => e.price * 0.3, // solo se cambian los LEDs
  heater: (e) => e.price,
};

function visit(nodes, visitor) {
  return nodes.reduce((total, node) => total + visitor[node.kind](node), 0);
}

console.log('kWh/mes:', visit(equipment, monthlyKwh)); // 25.2 + 32.4 + 36 = 93.6
console.log('Reposición:', visit(equipment, replacementCost)); // 355`,
  },
  related: ['composite', 'iterator', 'interpreter'],
};
