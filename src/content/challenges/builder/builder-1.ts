import type { Challenge } from '../../types';

export const builder1: Challenge = {
  id: 'builder-1',
  patternId: 'builder',
  title: {
    en: 'SQL query builder',
    es: 'Builder de consultas SQL',
    'pt-BR': 'Builder de consultas SQL',
  },
  difficulty: 'media',
  story: {
    en: 'Report screens build SQL by concatenating strings. Last week a filter value with a quote broke a query, and nobody remembers which limit is allowed.',
    es: 'Las pantallas de reportes arman SQL concatenando strings. La semana pasada un valor de filtro con comillas rompió una consulta, y nadie recuerda qué límite está permitido.',
    'pt-BR':
      'As telas de relatórios montam SQL concatenando strings. Semana passada um valor de filtro com aspas quebrou uma consulta, e ninguém lembra qual limite é permitido.',
  },
  instructions: {
    en: 'Implement `QueryBuilder` with chainable `from(table)`, `select(...columns)` (`*` by default), `where(field, value)` and `limit(n)`, and a `build()` that:\n- throws `Error("Missing table")` if `from` was not called;\n- throws `RangeError("Invalid limit")` if the limit is not between 1 and 1000;\n- joins `where` clauses with `AND` as `field = ?` and puts values in `params`;\n- returns `{ sql, params }` frozen with `Object.freeze`, e.g. `SELECT id, name FROM users WHERE status = ? LIMIT 10`.',
    es: 'Implementá `QueryBuilder` con `from(table)`, `select(...columns)` (`*` por defecto), `where(field, value)` y `limit(n)` encadenables, y un `build()` que:\n- lanza `Error("Missing table")` si no se llamó a `from`;\n- lanza `RangeError("Invalid limit")` si el límite no está entre 1 y 1000;\n- une los `where` con `AND` como `field = ?` y pone los valores en `params`;\n- devuelve `{ sql, params }` congelado con `Object.freeze`, por ejemplo `SELECT id, name FROM users WHERE status = ? LIMIT 10`.',
    'pt-BR':
      'Implemente `QueryBuilder` com `from(table)`, `select(...columns)` (`*` por padrão), `where(field, value)` e `limit(n)` encadeáveis, e um `build()` que:\n- lança `Error("Missing table")` se `from` não foi chamado;\n- lança `RangeError("Invalid limit")` se o limite não estiver entre 1 e 1000;\n- junta os `where` com `AND` como `field = ?` e coloca os valores em `params`;\n- devolve `{ sql, params }` congelado com `Object.freeze`, por exemplo `SELECT id, name FROM users WHERE status = ? LIMIT 10`.',
  },
  starterCode: `class QueryBuilder {
  from(table) {
    this.table = table;
  }

  build() {
    return { sql: 'SELECT * FROM ' + this.table, params: [] };
  }
}
`,
  tests: [
    {
      name: {
        en: 'builds a simple query',
        es: 'arma una consulta simple',
        'pt-BR': 'monta uma consulta simples',
      },
      code: `const q = new QueryBuilder().from('users').build();
expect(q.sql).toBe('SELECT * FROM users');
expect(q.params).toEqual([]);`,
    },
    {
      name: {
        en: 'methods chain and values go into params',
        es: 'los métodos se encadenan y los valores van a params',
        'pt-BR': 'os métodos se encadeiam e os valores vão para params',
      },
      code: `const q = new QueryBuilder().from('users').select('id', 'name').where('status', 'active').where('country', "O'Higgins").limit(10).build();
expect(q.sql).toBe('SELECT id, name FROM users WHERE status = ? AND country = ? LIMIT 10');
expect(q.params).toEqual(['active', "O'Higgins"]);`,
    },
    {
      name: { en: 'requires a table', es: 'exige una tabla', 'pt-BR': 'exige uma tabela' },
      code: `expect(() => new QueryBuilder().select('id').build()).toThrow('Missing table');`,
    },
    {
      name: { en: 'validates the limit', es: 'valida el límite', 'pt-BR': 'valida o limite' },
      code: `expect(() => new QueryBuilder().from('orders').limit(5000).build()).toThrow('Invalid limit');
expect(() => new QueryBuilder().from('orders').limit(0).build()).toThrow('Invalid limit');`,
    },
    {
      name: {
        en: 'the result is frozen',
        es: 'el resultado queda congelado',
        'pt-BR': 'o resultado fica congelado',
      },
      code: `const q = new QueryBuilder().from('orders').build();
expect(Object.isFrozen(q)).toBe(true);`,
    },
  ],
  hints: {
    en: [
      'Each method stores its value and does `return this` so calls can chain.',
      'Keep `where` as two arrays: the `field = ?` fragments and the values.',
      'All validation goes into `build()`; use `limit !== null` to know whether it was set.',
    ],
    es: [
      'Cada método guarda su dato y hace `return this` para poder encadenar.',
      'Guardá los `where` como dos arrays: los fragmentos `field = ?` y los valores.',
      'Toda la validación va en `build()`; usá `limit !== null` para saber si se definió.',
    ],
    'pt-BR': [
      'Cada método guarda seu dado e faz `return this` para poder encadear.',
      'Guarde os `where` como dois arrays: os fragmentos `field = ?` e os valores.',
      'Toda a validação vai em `build()`; use `limit !== null` para saber se foi definido.',
    ],
  },
  solution: `class QueryBuilder {
  #table = null;
  #columns = ['*'];
  #clauses = [];
  #params = [];
  #limit = null;

  from(table) {
    this.#table = table;
    return this;
  }
  select(...columns) {
    this.#columns = columns;
    return this;
  }
  where(field, value) {
    this.#clauses.push(field + ' = ?');
    this.#params.push(value);
    return this;
  }
  limit(n) {
    this.#limit = n;
    return this;
  }

  build() {
    if (!this.#table) throw new Error('Missing table');
    if (this.#limit !== null && (this.#limit < 1 || this.#limit > 1000)) {
      throw new RangeError('Invalid limit');
    }
    let sql = 'SELECT ' + this.#columns.join(', ') + ' FROM ' + this.#table;
    if (this.#clauses.length) sql += ' WHERE ' + this.#clauses.join(' AND ');
    if (this.#limit !== null) sql += ' LIMIT ' + this.#limit;
    return Object.freeze({ sql, params: [...this.#params] });
  }
}
`,
};
