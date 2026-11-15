import type { Challenge } from '../../types';

export const module1: Challenge = {
  id: 'module-1',
  patternId: 'module',
  title: {
    en: 'Private recent searches',
    es: 'Búsquedas recientes privadas',
    'pt-BR': 'Buscas recentes privadas',
  },
  difficulty: 'facil',
  story: {
    en: 'Recent searches lived in a global array. A component cleared it by mistake while rendering and the dropdown stopped showing suggestions.',
    es: 'Las búsquedas recientes vivían en un array global. Un componente lo vació por error al renderizar y el desplegable dejó de mostrar sugerencias.',
    'pt-BR':
      'As buscas recentes ficavam em um array global. Um componente o esvaziou por engano ao renderizar e o dropdown parou de mostrar sugestões.',
  },
  instructions: {
    en: 'Implement `createRecentSearches()`, which returns a frozen object with only three functions:\n- `add(term)`: trims the term; throws `TypeError` if it is empty; moves a repeated term to the front; keeps at most the last 5.\n- `list()`: returns a copy, newest first.\n- `clear()`: empties the list.\nThe list must not be reachable from outside.',
    es: 'Implementá `createRecentSearches()`, que devuelve un objeto congelado con solo tres funciones:\n- `add(term)`: recorta espacios; lanza `TypeError` si queda vacío; mueve al principio un término repetido; guarda como máximo los últimos 5.\n- `list()`: devuelve una copia, el más nuevo primero.\n- `clear()`: vacía la lista.\nLa lista no debe ser accesible desde afuera.',
    'pt-BR':
      'Implemente `createRecentSearches()`, que devolve um objeto congelado com apenas três funções:\n- `add(term)`: remove espaços das pontas; lança `TypeError` se ficar vazio; move para o começo um termo repetido; guarda no máximo os últimos 5.\n- `list()`: devolve uma cópia, o mais novo primeiro.\n- `clear()`: esvazia a lista.\nA lista não deve ser acessível de fora.',
  },
  starterCode: `function createRecentSearches() {
  return {
    items: [],
    add(term) {
      this.items.unshift(term);
    },
    list() {
      return this.items;
    },
    clear() {
      this.items = [];
    },
  };
}
`,
  tests: [
    {
      name: {
        en: 'keeps the newest first',
        es: 'guarda la más nueva primero',
        'pt-BR': 'guarda a mais nova primeiro',
      },
      code: `const recent = createRecentSearches();
recent.add('shoes');
recent.add(' jackets ');
expect(recent.list()).toEqual(['jackets', 'shoes']);`,
    },
    {
      name: {
        en: 'exposes only the public API',
        es: 'expone solo la API pública',
        'pt-BR': 'expõe só a API pública',
      },
      code: `const recent = createRecentSearches();
expect(Object.keys(recent).sort()).toEqual(['add', 'clear', 'list']);
expect(Object.isFrozen(recent)).toBe(true);`,
    },
    {
      name: {
        en: 'the list cannot be changed from outside',
        es: 'la lista no se puede cambiar desde afuera',
        'pt-BR': 'a lista não pode ser mudada de fora',
      },
      code: `const recent = createRecentSearches();
recent.add('shoes');
recent.list().length = 0;
expect(recent.list()).toEqual(['shoes']);`,
    },
    {
      name: {
        en: 'moves repeats to the front and keeps the last 5',
        es: 'mueve los repetidos al principio y guarda los últimos 5',
        'pt-BR': 'move os repetidos para o começo e guarda os últimos 5',
      },
      code: `const recent = createRecentSearches();
for (const t of ['a', 'b', 'c', 'd', 'e', 'f']) recent.add(t);
recent.add('c');
expect(recent.list()).toEqual(['c', 'f', 'e', 'd', 'b']);`,
    },
    {
      name: {
        en: 'rejects empty terms and each list is independent',
        es: 'rechaza términos vacíos y cada lista es independiente',
        'pt-BR': 'rejeita termos vazios e cada lista é independente',
      },
      code: `const a = createRecentSearches();
const b = createRecentSearches();
expect(() => a.add('   ')).toThrow();
a.add('x');
expect(b.list()).toEqual([]);`,
    },
  ],
  hints: {
    en: [
      'Declare the array inside the function: the closure keeps it alive and private.',
      '`list()` should return `[...items]` so callers cannot mutate the original.',
      'Return `Object.freeze({ add, list, clear })`.',
    ],
    es: [
      'Declará el array dentro de la función: el closure lo mantiene vivo y privado.',
      '`list()` debería devolver `[...items]` para que nadie mute el original.',
      'Devolvé `Object.freeze({ add, list, clear })`.',
    ],
    'pt-BR': [
      'Declare o array dentro da função: o closure o mantém vivo e privado.',
      '`list()` deveria devolver `[...items]` para que ninguém altere o original.',
      'Devolva `Object.freeze({ add, list, clear })`.',
    ],
  },
  solution: `function createRecentSearches() {
  let items = [];

  function add(term) {
    const clean = String(term).trim();
    if (!clean) throw new TypeError('Empty search term');
    items = [clean, ...items.filter((t) => t !== clean)].slice(0, 5);
  }

  function list() {
    return [...items];
  }

  function clear() {
    items = [];
  }

  return Object.freeze({ add, list, clear });
}
`,
};
