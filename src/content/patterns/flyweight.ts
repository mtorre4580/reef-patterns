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
      en: 'A school of fish in the simulator',
      es: 'Cardumen en el simulador',
      'pt-BR': 'Cardume no simulador',
    },
    scenario: {
      en: 'The reef simulator draws thousands of fish. Species, colors and speed are shared per species; each fish only stores its position.',
      es: 'El simulador del arrecife dibuja miles de peces. Especie, colores y velocidad se comparten por especie; cada pez solo guarda su posición.',
      'pt-BR':
        'O simulador do recife desenha milhares de peixes. Espécie, cores e velocidade são compartilhadas por espécie; cada peixe só guarda sua posição.',
    },
    code: `class FishSpecies {
  constructor(name, colors, speed) {
    Object.assign(this, { name, colors, speed });
    Object.freeze(this);
  }
}

const speciesPool = new Map();
function getSpecies(name, colors, speed) {
  if (!speciesPool.has(name)) speciesPool.set(name, new FishSpecies(name, colors, speed));
  return speciesPool.get(name);
}

// Extrinsic state: only what changes per fish
function createFish(speciesName, x, y) {
  const species =
    speciesName === 'chromis'
      ? getSpecies('Chromis viridis', ['green', 'blue'], 1.2)
      : getSpecies('Amphiprion ocellaris', ['orange', 'white'], 0.8);
  return { species, x, y };
}

const school = Array.from({ length: 5000 }, (_, i) =>
  createFish(i % 10 === 0 ? 'clown' : 'chromis', i % 100, Math.floor(i / 100)),
);

console.log(school.length, 'fish,', speciesPool.size, 'species in memory'); // 5000 fish, 2 species
console.log(school[0].species === school[1].species); // false: 0 is a clownfish, 1 is a chromis
console.log(school[1].species === school[2].species); // true: they share the same species`,
  },
  related: ['object-pool', 'prototype', 'proxy'],
};
