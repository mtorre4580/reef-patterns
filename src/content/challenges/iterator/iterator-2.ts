import type { Challenge } from '../../types';

export const iterator2: Challenge = {
  id: 'iterator-2',
  patternId: 'iterator',
  title: 'Rango de profundidades',
  difficulty: 'facil',
  story:
    'El planificador recorre profundidades de a 3 m para calcular tiempos. Generar un array enorme cada vez es un desperdicio: casi siempre se corta antes.',
  instructions:
    'Implementá `depthRange(from, to, step = 3)` como un iterador perezoso (no un array):\n' +
    '- Incluye `from` y `to` si cae justo.\n' +
    '- Si `from > to`, recorre hacia arriba (descendiendo de profundidad).',
  starterCode: `function depthRange(from, to, step = 3) {
  const depths = [];
  for (let d = from; d <= to; d += step) depths.push(d);
  return depths;
}
`,
  tests: [
    {
      name: 'genera el rango ascendente',
      code: `expect([...depthRange(0, 10, 5)]).toEqual([0, 5, 10]);
expect([...depthRange(0, 9)]).toEqual([0, 3, 6, 9]);`,
    },
    {
      name: 'genera el rango descendente',
      code: `expect([...depthRange(12, 0, 4)]).toEqual([12, 8, 4, 0]);`,
    },
    {
      name: 'es perezoso',
      code: `const it = depthRange(0, 30, 1);
expect(Array.isArray(it)).toBe(false);
expect(it.next().value).toBe(0);
expect(it.next().value).toBe(1);`,
    },
  ],
  hints: [
    'Una función generadora (`function*`) devuelve un iterador perezoso.',
    'Calculá la dirección con `Math.sign(to - from)` y multiplicá el paso.',
  ],
  solution: `function* depthRange(from, to, step = 3) {
  const direction = from <= to ? 1 : -1;
  for (let d = from; direction > 0 ? d <= to : d >= to; d += step * direction) {
    yield d;
  }
}
`,
};
