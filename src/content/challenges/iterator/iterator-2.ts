import type { Challenge } from '../../types';

export const iterator2: Challenge = {
  id: 'iterator-2',
  patternId: 'iterator',
  title: {
    en: 'Lazy number range',
    es: 'Rango numérico perezoso',
    'pt-BR': 'Intervalo numérico preguiçoso',
  },
  difficulty: 'facil',
  story: {
    en: 'The pagination component and the chart axis both build ranges of numbers. Building a huge array every time is wasteful: most loops stop early.',
    es: 'El componente de paginación y el eje del gráfico arman rangos de números. Crear un array enorme cada vez es un desperdicio: casi todos los bucles cortan antes.',
    'pt-BR':
      'O componente de paginação e o eixo do gráfico montam intervalos de números. Criar um array enorme toda vez é um desperdício: quase todos os laços param antes.',
  },
  instructions: {
    en: 'Implement `range(from, to, step = 1)` as a lazy iterator (not an array):\n- It includes `from`, and `to` when it lands exactly.\n- If `from > to`, it counts down.',
    es: 'Implementá `range(from, to, step = 1)` como un iterador perezoso (no un array):\n- Incluye `from`, y `to` si cae justo.\n- Si `from > to`, cuenta hacia abajo.',
    'pt-BR':
      'Implemente `range(from, to, step = 1)` como um iterador preguiçoso (não um array):\n- Inclui `from`, e `to` se cair exatamente.\n- Se `from > to`, conta para baixo.',
  },
  starterCode: `function range(from, to, step = 1) {
  const numbers = [];
  for (let n = from; n <= to; n += step) numbers.push(n);
  return numbers;
}
`,
  tests: [
    {
      name: {
        en: 'generates an ascending range',
        es: 'genera el rango ascendente',
        'pt-BR': 'gera o intervalo ascendente',
      },
      code: `expect([...range(1, 5)]).toEqual([1, 2, 3, 4, 5]);
expect([...range(0, 10, 5)]).toEqual([0, 5, 10]);`,
    },
    {
      name: {
        en: 'generates a descending range',
        es: 'genera el rango descendente',
        'pt-BR': 'gera o intervalo descendente',
      },
      code: `expect([...range(10, 0, 4)]).toEqual([10, 6, 2]);`,
    },
    {
      name: { en: 'is lazy', es: 'es perezoso', 'pt-BR': 'é preguiçoso' },
      code: `const it = range(1, 30);
expect(Array.isArray(it)).toBe(false);
expect(it.next().value).toBe(1);
expect(it.next().value).toBe(2);`,
    },
  ],
  hints: {
    en: [
      'A generator function (`function*`) returns a lazy iterator.',
      'Compute the direction once (`from <= to ? 1 : -1`) and multiply the step.',
    ],
    es: [
      'Una función generadora (`function*`) devuelve un iterador perezoso.',
      'Calculá la dirección una vez (`from <= to ? 1 : -1`) y multiplicá el paso.',
    ],
    'pt-BR': [
      'Uma função geradora (`function*`) devolve um iterador preguiçoso.',
      'Calcule a direção uma vez (`from <= to ? 1 : -1`) e multiplique o passo.',
    ],
  },
  solution: `function* range(from, to, step = 1) {
  const direction = from <= to ? 1 : -1;
  for (let n = from; direction > 0 ? n <= to : n >= to; n += step * direction) {
    yield n;
  }
}
`,
};
