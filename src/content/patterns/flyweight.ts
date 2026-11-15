import type { Pattern } from '../types';

export const flyweight: Pattern = {
  id: 'flyweight',
  rank: 41,
  name: 'Flyweight',
  localName: { en: 'Flyweight', es: 'Peso ligero', 'pt-BR': 'Peso-mosca' },
  category: 'estructural',
  tier: 3,
  gof: true,
  summary: {
    en: 'Shares the immutable part of many similar objects to save memory, and keeps only what changes separately.',
    es: 'Comparte la parte inmutable de muchos objetos parecidos para ahorrar memoria, y guarda aparte solo lo que cambia.',
    'pt-BR':
      'Compartilha a parte imutável de muitos objetos parecidos para economizar memória e guarda à parte só o que muda.',
  },
  when: {
    en: 'When you create thousands of nearly identical objects (particles, cells, glyphs, sprites) and memory or GC starts to show.',
    es: 'Cuando creás miles de objetos casi iguales (partículas, celdas, glifos, sprites) y la memoria o el GC empiezan a notarse.',
    'pt-BR':
      'Quando você cria milhares de objetos quase iguais (partículas, células, glifos, sprites) e a memória ou o GC começam a pesar.',
  },
  pros: {
    en: ['Large memory savings with many objects.', 'Less pressure on the garbage collector.'],
    es: [
      'Ahorro grande de memoria con muchos objetos.',
      'Menos presión sobre el recolector de basura.',
    ],
    'pt-BR': [
      'Grande economia de memória com muitos objetos.',
      'Menos pressão sobre o coletor de lixo.',
    ],
  },
  cons: {
    en: [
      'Splitting intrinsic and extrinsic state complicates the code.',
      'Only worth it with really large volumes.',
    ],
    es: [
      'Separar estado intrínseco y extrínseco complica el código.',
      'Solo vale la pena con volúmenes realmente grandes.',
    ],
    'pt-BR': [
      'Separar estado intrínseco e extrínseco complica o código.',
      'Só vale a pena com volumes realmente grandes.',
    ],
  },
  realWorld: {
    en: 'String interning in JS engines, texture atlases in games, reused rows in virtualized lists.',
    es: 'El interning de strings de los motores JS, los atlas de texturas en juegos, las filas reutilizadas de listas virtualizadas.',
    'pt-BR':
      'O interning de strings dos motores JS, os atlas de texturas em jogos, as linhas reutilizadas de listas virtualizadas.',
  },
  example: {
    title: {
      en: 'Shared cell formats in a spreadsheet',
      es: 'Formatos compartidos en una planilla',
      'pt-BR': 'Formatos compartilhados em uma planilha',
    },
    scenario: {
      en: 'A spreadsheet view renders 100,000 cells. Font, color and number format are shared objects; each cell only stores its value and a reference to its format.',
      es: 'Una vista de planilla renderiza 100.000 celdas. La fuente, el color y el formato numérico son objetos compartidos; cada celda solo guarda su valor y una referencia al formato.',
      'pt-BR':
        'Uma visão de planilha renderiza 100.000 células. A fonte, a cor e o formato numérico são objetos compartilhados; cada célula só guarda seu valor e uma referência ao formato.',
    },
    code: `class CellFormat {
  constructor(font, color, numberFormat) {
    Object.assign(this, { font, color, numberFormat });
    Object.freeze(this);
  }
}

const formats = new Map();
function getFormat(font, color, numberFormat) {
  const key = [font, color, numberFormat].join('|');
  if (!formats.has(key)) formats.set(key, new CellFormat(font, color, numberFormat));
  return formats.get(key);
}

// Extrinsic state: only what changes per cell
const createCell = (row, col, value) => ({
  row,
  col,
  value,
  format: col === 0 ? getFormat('Inter', '#111', 'text') : getFormat('Inter Mono', '#1d5b94', '0.00'),
});

const cells = [];
for (let row = 0; row < 25_000; row++) {
  for (let col = 0; col < 4; col++) cells.push(createCell(row, col, row * col));
}

console.log(cells.length, 'cells,', formats.size, 'formats in memory'); // 100000 cells, 2 formats
console.log(cells[1].format === cells[2].format); // true: shared format`,
  },
  related: ['object-pool', 'prototype', 'proxy'],
};
