import type { Challenge } from '../../types';

export const iterator1: Challenge = {
  id: 'iterator-1',
  patternId: 'iterator',
  title: {
    en: 'Paginated dive log',
    es: 'Log de inmersiones paginado',
    'pt-BR': 'Log de mergulhos paginado',
  },
  difficulty: 'media',
  story: {
    en: 'The dive log lives on the server, paginated. The stats screen downloads every page even though it only needs the first deep dive.',
    es: 'El log de inmersiones vive en el servidor, paginado. La pantalla de estadísticas descarga todas las páginas aunque solo necesite la primera inmersión profunda.',
    'pt-BR':
      'O log de mergulhos vive no servidor, paginado. A tela de estatísticas baixa todas as páginas, embora só precise do primeiro mergulho profundo.',
  },
  instructions: {
    en: 'Implement `DiveLog` with `constructor(fetchPage)` and the iterable protocol (`[Symbol.iterator]`):\n- `fetchPage(n)` returns an array of dives or `null` when there are no more pages (starting at 0).\n- Looping over the log with `for…of` must return every dive in order.\n- It must be lazy: a page is requested only when needed.',
    es: 'Implementá `DiveLog` con `constructor(fetchPage)` y el protocolo iterable (`[Symbol.iterator]`):\n- `fetchPage(n)` devuelve un array de inmersiones o `null` cuando no hay más páginas (empieza en 0).\n- Recorrer el log con `for…of` debe devolver todas las inmersiones en orden.\n- Debe ser perezoso: una página se pide solo cuando hace falta.',
    'pt-BR':
      'Implemente `DiveLog` com `constructor(fetchPage)` e o protocolo iterável (`[Symbol.iterator]`):\n- `fetchPage(n)` devolve um array de mergulhos ou `null` quando não há mais páginas (começa em 0).\n- Percorrer o log com `for…of` deve devolver todos os mergulhos em ordem.\n- Deve ser preguiçoso: uma página só é pedida quando necessário.',
  },
  starterCode: `class DiveLog {
  constructor(fetchPage) {
    this.fetchPage = fetchPage;
  }

  getAll() {
    const all = [];
    for (let page = 0; ; page++) {
      const dives = this.fetchPage(page);
      if (!dives) return all;
      all.push(...dives);
    }
  }
}
`,
  tests: [
    {
      name: {
        en: 'walks every dive in order',
        es: 'recorre todas las inmersiones en orden',
        'pt-BR': 'percorre todos os mergulhos em ordem',
      },
      code: `const pages = [[{ site: 'A' }, { site: 'B' }], [{ site: 'C' }]];
const log = new DiveLog((n) => pages[n] ?? null);
expect([...log].map((d) => d.site)).toEqual(['A', 'B', 'C']);`,
    },
    {
      name: {
        en: 'is lazy: never requests extra pages',
        es: 'es perezoso: no pide páginas de más',
        'pt-BR': 'é preguiçoso: não pede páginas a mais',
      },
      code: `const pages = [[{ depth: 12 }, { depth: 33 }], [{ depth: 40 }], [{ depth: 8 }]];
const fetchPage = fn((n) => pages[n] ?? null);
for (const dive of new DiveLog(fetchPage)) {
  if (dive.depth > 30) break;
}
expect(fetchPage.calls).toEqual([[0]]);`,
    },
    {
      name: {
        en: 'an empty log does not iterate',
        es: 'un log vacío no itera',
        'pt-BR': 'um log vazio não itera',
      },
      code: `expect([...new DiveLog(() => null)]).toEqual([]);`,
    },
    {
      name: {
        en: 'can be walked more than once',
        es: 'se puede recorrer más de una vez',
        'pt-BR': 'pode ser percorrido mais de uma vez',
      },
      code: `const log = new DiveLog((n) => (n === 0 ? [{ site: 'Only one' }] : null));
expect([...log].length).toBe(1);
expect([...log].length).toBe(1);`,
    },
  ],
  hints: {
    en: [
      'A generator method `*[Symbol.iterator]() { … }` implements the protocol for you.',
      'Inside the generator, request page by page in a loop and use `yield* dives`.',
    ],
    es: [
      'Un método generador `*[Symbol.iterator]() { … }` implementa el protocolo por vos.',
      'Dentro del generador, pedí página por página en un bucle y usá `yield* dives`.',
    ],
    'pt-BR': [
      'Um método gerador `*[Symbol.iterator]() { … }` implementa o protocolo por você.',
      'Dentro do gerador, peça página por página em um laço e use `yield* dives`.',
    ],
  },
  solution: `class DiveLog {
  constructor(fetchPage) {
    this.fetchPage = fetchPage;
  }

  *[Symbol.iterator]() {
    for (let page = 0; ; page++) {
      const dives = this.fetchPage(page);
      if (!dives) return;
      yield* dives;
    }
  }
}
`,
};
