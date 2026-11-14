import type { Challenge } from '../../types';

export const iterator1: Challenge = {
  id: 'iterator-1',
  patternId: 'iterator',
  title: 'Log de inmersiones paginado',
  difficulty: 'media',
  story:
    'El log de inmersiones vive en el servidor, paginado. La pantalla de estadísticas descarga todas las páginas aunque solo necesite la primera inmersión profunda.',
  instructions:
    'Implementá `DiveLog` con `constructor(fetchPage)` y el protocolo iterable (`[Symbol.iterator]`):\n' +
    '- `fetchPage(n)` devuelve un array de inmersiones o `null` cuando no hay más páginas (empieza en 0).\n' +
    '- Recorrer el log con `for…of` debe devolver todas las inmersiones en orden.\n' +
    '- Debe ser perezoso: una página se pide solo cuando hace falta.',
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
      name: 'recorre todas las inmersiones en orden',
      code: `const pages = [[{ site: 'A' }, { site: 'B' }], [{ site: 'C' }]];
const log = new DiveLog((n) => pages[n] ?? null);
expect([...log].map((d) => d.site)).toEqual(['A', 'B', 'C']);`,
    },
    {
      name: 'es perezoso: no pide páginas de más',
      code: `const pages = [[{ depth: 12 }, { depth: 33 }], [{ depth: 40 }], [{ depth: 8 }]];
const fetchPage = fn((n) => pages[n] ?? null);
for (const dive of new DiveLog(fetchPage)) {
  if (dive.depth > 30) break;
}
expect(fetchPage.calls).toEqual([[0]]);`,
    },
    {
      name: 'un log vacío no itera',
      code: `expect([...new DiveLog(() => null)]).toEqual([]);`,
    },
    {
      name: 'se puede recorrer más de una vez',
      code: `const log = new DiveLog((n) => (n === 0 ? [{ site: 'Única' }] : null));
expect([...log].length).toBe(1);
expect([...log].length).toBe(1);`,
    },
  ],
  hints: [
    'Un método generador `*[Symbol.iterator]() { … }` implementa el protocolo por vos.',
    'Dentro del generador, pedí página por página en un bucle y usá `yield* dives`.',
  ],
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
