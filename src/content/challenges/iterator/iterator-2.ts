import type { Challenge } from '../../types';

export const iterator2: Challenge = {
  id: 'iterator-2',
  patternId: 'iterator',
  title: { en: 'Depth range', es: 'Rango de profundidades', 'pt-BR': 'Faixa de profundidades' },
  difficulty: 'facil',
  story: {
    en: 'The planner walks depths in 3 m steps to compute times. Building a huge array every time is wasteful: it almost always stops early.',
    es: 'El planificador recorre profundidades de a 3 m para calcular tiempos. Generar un array enorme cada vez es un desperdicio: casi siempre se corta antes.',
    'pt-BR':
      'O planejador percorre profundidades de 3 em 3 m para calcular tempos. Gerar um array enorme toda vez é um desperdício: quase sempre se interrompe antes.',
  },
  instructions: {
    en: 'Implement `depthRange(from, to, step = 3)` as a lazy iterator (not an array):\n- It includes `from`, and `to` when it lands exactly.\n- If `from > to`, it walks upwards (decreasing depth).',
    es: 'Implementá `depthRange(from, to, step = 3)` como un iterador perezoso (no un array):\n- Incluye `from` y `to` si cae justo.\n- Si `from > to`, recorre hacia arriba (descendiendo de profundidad).',
    'pt-BR':
      'Implemente `depthRange(from, to, step = 3)` como um iterador preguiçoso (não um array):\n- Inclui `from`, e `to` se cair exatamente.\n- Se `from > to`, percorre para cima (diminuindo a profundidade).',
  },
  starterCode: `function depthRange(from, to, step = 3) {
  const depths = [];
  for (let d = from; d <= to; d += step) depths.push(d);
  return depths;
}
`,
  tests: [
    {
      name: {
        en: 'generates the ascending range',
        es: 'genera el rango ascendente',
        'pt-BR': 'gera a faixa ascendente',
      },
      code: `expect([...depthRange(0, 10, 5)]).toEqual([0, 5, 10]);
expect([...depthRange(0, 9)]).toEqual([0, 3, 6, 9]);`,
    },
    {
      name: {
        en: 'generates the descending range',
        es: 'genera el rango descendente',
        'pt-BR': 'gera a faixa descendente',
      },
      code: `expect([...depthRange(12, 0, 4)]).toEqual([12, 8, 4, 0]);`,
    },
    {
      name: { en: 'is lazy', es: 'es perezoso', 'pt-BR': 'é preguiçoso' },
      code: `const it = depthRange(0, 30, 1);
expect(Array.isArray(it)).toBe(false);
expect(it.next().value).toBe(0);
expect(it.next().value).toBe(1);`,
    },
  ],
  hints: {
    en: [
      'A generator function (`function*`) returns a lazy iterator.',
      'Compute the direction with `Math.sign(to - from)` and multiply the step.',
    ],
    es: [
      'Una función generadora (`function*`) devuelve un iterador perezoso.',
      'Calculá la dirección con `Math.sign(to - from)` y multiplicá el paso.',
    ],
    'pt-BR': [
      'Uma função geradora (`function*`) devolve um iterador preguiçoso.',
      'Calcule a direção com `Math.sign(to - from)` e multiplique o passo.',
    ],
  },
  solution: `function* depthRange(from, to, step = 3) {
  const direction = from <= to ? 1 : -1;
  for (let d = from; direction > 0 ? d <= to : d >= to; d += step * direction) {
    yield d;
  }
}
`,
};
