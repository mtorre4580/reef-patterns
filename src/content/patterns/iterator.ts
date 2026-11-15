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
      en: 'Paginated API results',
      es: 'Resultados paginados de una API',
      'pt-BR': 'Resultados paginados de uma API',
    },
    scenario: {
      en: 'The orders API returns 50 results per page with a cursor. The export screen wants to walk orders one by one and stop at the first refund, without downloading every page.',
      es: 'La API de órdenes devuelve 50 resultados por página con un cursor. La pantalla de exportación quiere recorrerlas una por una y cortar en el primer reembolso, sin bajar todas las páginas.',
      'pt-BR':
        'A API de pedidos devolve 50 resultados por página com um cursor. A tela de exportação quer percorrê-los um a um e parar no primeiro reembolso, sem baixar todas as páginas.',
    },
    code: `// Fake API: three pages linked by cursors
const pages = {
  start: { items: [{ id: 1, type: 'sale' }, { id: 2, type: 'sale' }], next: 'p2' },
  p2: { items: [{ id: 3, type: 'refund' }, { id: 4, type: 'sale' }], next: 'p3' },
  p3: { items: [{ id: 5, type: 'sale' }], next: null },
};
const fetchPage = (cursor) => {
  console.log('GET /orders?cursor=' + cursor);
  return pages[cursor];
};

// Generator: fetches a page only when the consumer needs more items
function* orders() {
  let cursor = 'start';
  while (cursor) {
    const page = fetchPage(cursor);
    yield* page.items;
    cursor = page.next;
  }
}

for (const order of orders()) {
  if (order.type === 'refund') {
    console.log('First refund:', order.id);
    break; // page p3 is never requested
  }
}`,
  },
  related: ['composite', 'visitor'],
};
