import type { Challenge } from '../../types';

export const iterator1: Challenge = {
  id: 'iterator-1',
  patternId: 'iterator',
  title: {
    en: 'Paginated API results',
    es: 'Resultados paginados de una API',
    'pt-BR': 'Resultados paginados de uma API',
  },
  difficulty: 'media',
  story: {
    en: 'The customers API returns pages linked by a cursor. The export screen downloads every page even though it usually only needs the first match.',
    es: 'La API de clientes devuelve páginas enlazadas por un cursor. La pantalla de exportación baja todas las páginas aunque casi siempre solo necesita la primera coincidencia.',
    'pt-BR':
      'A API de clientes devolve páginas ligadas por um cursor. A tela de exportação baixa todas as páginas, embora quase sempre só precise da primeira ocorrência.',
  },
  instructions: {
    en: 'Implement `PagedCollection` with `constructor(fetchPage)` and the iterable protocol (`[Symbol.iterator]`):\n- `fetchPage(cursor)` returns `{ items, next }` for a cursor, starting with `null`; `next` is the next cursor or `null` when there are no more pages.\n- Looping with `for…of` must return every item in order.\n- It must be lazy: a page is requested only when needed.',
    es: 'Implementá `PagedCollection` con `constructor(fetchPage)` y el protocolo iterable (`[Symbol.iterator]`):\n- `fetchPage(cursor)` devuelve `{ items, next }` para un cursor, empezando por `null`; `next` es el próximo cursor o `null` si no hay más páginas.\n- Recorrerla con `for…of` debe devolver todos los items en orden.\n- Debe ser perezosa: una página se pide solo cuando hace falta.',
    'pt-BR':
      'Implemente `PagedCollection` com `constructor(fetchPage)` e o protocolo iterável (`[Symbol.iterator]`):\n- `fetchPage(cursor)` devolve `{ items, next }` para um cursor, começando por `null`; `next` é o próximo cursor ou `null` quando não há mais páginas.\n- Percorrê-la com `for…of` deve devolver todos os itens em ordem.\n- Deve ser preguiçosa: uma página só é pedida quando necessário.',
  },
  starterCode: `class PagedCollection {
  constructor(fetchPage) {
    this.fetchPage = fetchPage;
  }

  getAll() {
    const all = [];
    let cursor = null;
    do {
      const page = this.fetchPage(cursor);
      all.push(...page.items);
      cursor = page.next;
    } while (cursor);
    return all;
  }
}
`,
  tests: [
    {
      name: {
        en: 'walks every item in order',
        es: 'recorre todos los items en orden',
        'pt-BR': 'percorre todos os itens em ordem',
      },
      code: `const pages = { null: { items: ['a', 'b'], next: 'c2' }, c2: { items: ['c'], next: null } };
const customers = new PagedCollection((cursor) => pages[String(cursor)]);
expect([...customers]).toEqual(['a', 'b', 'c']);`,
    },
    {
      name: {
        en: 'is lazy: never requests extra pages',
        es: 'es perezosa: no pide páginas de más',
        'pt-BR': 'é preguiçosa: não pede páginas a mais',
      },
      code: `const pages = { null: { items: [1, 2], next: 'c2' }, c2: { items: [3], next: 'c3' }, c3: { items: [4], next: null } };
const fetchPage = fn((cursor) => pages[String(cursor)]);
for (const n of new PagedCollection(fetchPage)) {
  if (n === 2) break;
}
expect(fetchPage.calls).toEqual([[null]]);`,
    },
    {
      name: {
        en: 'an empty first page does not iterate',
        es: 'una primera página vacía no itera',
        'pt-BR': 'uma primeira página vazia não itera',
      },
      code: `expect([...new PagedCollection(() => ({ items: [], next: null }))]).toEqual([]);`,
    },
    {
      name: {
        en: 'can be walked more than once',
        es: 'se puede recorrer más de una vez',
        'pt-BR': 'pode ser percorrida mais de uma vez',
      },
      code: `const collection = new PagedCollection(() => ({ items: ['only'], next: null }));
expect([...collection].length).toBe(1);
expect([...collection].length).toBe(1);`,
    },
  ],
  hints: {
    en: [
      'A generator method `*[Symbol.iterator]() { … }` implements the protocol for you.',
      'Inside the generator, request page by page in a loop and use `yield* page.items`.',
    ],
    es: [
      'Un método generador `*[Symbol.iterator]() { … }` implementa el protocolo por vos.',
      'Dentro del generador, pedí página por página en un bucle y usá `yield* page.items`.',
    ],
    'pt-BR': [
      'Um método gerador `*[Symbol.iterator]() { … }` implementa o protocolo por você.',
      'Dentro do gerador, peça página por página em um laço e use `yield* page.items`.',
    ],
  },
  solution: `class PagedCollection {
  constructor(fetchPage) {
    this.fetchPage = fetchPage;
  }

  *[Symbol.iterator]() {
    let cursor = null;
    do {
      const page = this.fetchPage(cursor);
      yield* page.items;
      cursor = page.next;
    } while (cursor);
  }
}
`,
};
