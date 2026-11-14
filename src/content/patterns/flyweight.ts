import type { Pattern } from '../types';

export const flyweight: Pattern = {
  id: 'flyweight',
  rank: 41,
  name: 'Flyweight',
  nameEs: 'Peso ligero',
  category: 'estructural',
  tier: 3,
  gof: true,
  summary:
    'Comparte la parte inmutable de muchos objetos parecidos para ahorrar memoria, y guarda aparte solo lo que cambia.',
  when: 'Cuando creás miles de objetos casi iguales (partículas, celdas, glifos, sprites) y la memoria o el GC empiezan a notarse.',
  pros: [
    'Ahorro grande de memoria con muchos objetos.',
    'Menos presión sobre el recolector de basura.',
  ],
  cons: [
    'Separar estado intrínseco y extrínseco complica el código.',
    'Solo vale la pena con volúmenes realmente grandes.',
  ],
  realWorld:
    'El interning de strings de los motores JS, los atlas de texturas en juegos, las filas reutilizadas de listas virtualizadas.',
  example: {
    title: 'Cardumen en el simulador',
    scenario:
      'El simulador del arrecife dibuja miles de peces. Especie, colores y velocidad se comparten por especie; cada pez solo guarda su posición.',
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

// Estado extrínseco: solo lo que cambia por pez
function createFish(speciesName, x, y) {
  const species =
    speciesName === 'chromis'
      ? getSpecies('Chromis viridis', ['verde', 'azul'], 1.2)
      : getSpecies('Amphiprion ocellaris', ['naranja', 'blanco'], 0.8);
  return { species, x, y };
}

const school = Array.from({ length: 5000 }, (_, i) =>
  createFish(i % 10 === 0 ? 'clown' : 'chromis', i % 100, Math.floor(i / 100)),
);

console.log(school.length, 'peces,', speciesPool.size, 'especies en memoria'); // 5000 peces, 2 especies
console.log(school[0].species === school[1].species); // false: 0 es payaso, 1 es chromis
console.log(school[1].species === school[2].species); // true: comparten la misma especie`,
  },
  related: ['object-pool', 'prototype', 'proxy'],
};
