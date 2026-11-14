import type { Pattern } from '../types';

export const iterator: Pattern = {
  id: 'iterator',
  rank: 11,
  name: 'Iterator',
  localName: { en: 'Iterator', es: 'Iterador', 'pt-BR': 'Iterador' },
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary: {
    en: 'Walks a collection one element at a time without exposing how it is stored.',
    es: 'Recorre una colección elemento por elemento sin exponer cómo está almacenada.',
    'pt-BR': 'Percorre uma coleção elemento por elemento sem expor como ela é armazenada.',
  },
  when: {
    en: 'When you want to loop over data with for…of regardless of whether it comes from an array, a tree or a paginated API, or when producing it lazily pays off.',
    es: 'Cuando querés recorrer datos con for…of sin importar si vienen de un array, un árbol o una API paginada, o cuando conviene producirlos de forma perezosa.',
    'pt-BR':
      'Quando você quer percorrer dados com for…of sem importar se vêm de um array, de uma árvore ou de uma API paginada, ou quando convém produzi-los de forma preguiçosa.',
  },
  pros: {
    en: [
      'A uniform interface (for…of, spread, destructuring).',
      'Lazy evaluation: only what is consumed gets computed.',
      'Hides the internal structure of the collection.',
    ],
    es: [
      'Interfaz uniforme (for…of, spread, destructuring).',
      'Evaluación perezosa: se calcula solo lo que se consume.',
      'Oculta la estructura interna de la colección.',
    ],
    'pt-BR': [
      'Interface uniforme (for…of, spread, desestruturação).',
      'Avaliação preguiçosa: só se calcula o que é consumido.',
      'Esconde a estrutura interna da coleção.',
    ],
  },
  cons: {
    en: ['Iterators are single-use and stateful.', 'For small collections, an array is simpler.'],
    es: [
      'Los iteradores son de un solo uso y con estado.',
      'Para colecciones chicas, un array es más simple.',
    ],
    'pt-BR': [
      'Os iteradores são de uso único e têm estado.',
      'Para coleções pequenas, um array é mais simples.',
    ],
  },
  realWorld: {
    en: 'The Symbol.iterator protocol, function* generators, the ES2025 Iterator helpers, for await…of over streams.',
    es: 'El protocolo Symbol.iterator, los generadores function*, los Iterator helpers de ES2025, for await…of sobre streams.',
    'pt-BR':
      'O protocolo Symbol.iterator, os geradores function*, os Iterator helpers do ES2025, for await…of sobre streams.',
  },
  example: {
    title: {
      en: 'Paginated dive log',
      es: 'Log de inmersiones paginado',
      'pt-BR': 'Log de mergulhos paginado',
    },
    scenario: {
      en: 'The log holds hundreds of dives stored by page. The stats screen wants to walk them one by one and stop at the first dive deeper than 30 m.',
      es: 'El log tiene cientos de inmersiones guardadas por página. La pantalla de estadísticas quiere recorrerlas una por una y cortar al encontrar la primera de más de 30 m.',
      'pt-BR':
        'O log tem centenas de mergulhos guardados por página. A tela de estatísticas quer percorrê-los um a um e parar no primeiro com mais de 30 m.',
    },
    code: `const pages = [
  [{ site: 'Red Shoal', depth: 18 }, { site: 'The Wall', depth: 27 }],
  [{ site: 'The Wreck', depth: 33 }, { site: 'Coral Garden', depth: 12 }],
  [{ site: 'Blue Cave', depth: 40 }],
];

class DiveLog {
  constructor(fetchPage) {
    this.fetchPage = fetchPage;
  }

  // Generator: fetches a page only when needed
  *[Symbol.iterator]() {
    for (let page = 0; ; page++) {
      const dives = this.fetchPage(page);
      if (!dives) return;
      console.log('Loading page ' + page);
      yield* dives;
    }
  }
}

const log = new DiveLog((n) => pages[n]);

for (const dive of log) {
  if (dive.depth > 30) {
    console.log('First deep dive:', dive.site);
    break; // page 2 is never loaded
  }
}`,
  },
  related: ['composite', 'visitor'],
};
