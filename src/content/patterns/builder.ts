import type { Pattern } from '../types';

export const builder: Pattern = {
  id: 'builder',
  rank: 9,
  name: 'Builder',
  localName: { en: 'Builder', es: 'Constructor', 'pt-BR': 'Construtor' },
  category: 'creacional',
  tier: 1,
  gof: true,
  summary: {
    en: 'Builds a complex object step by step with a fluent API and validates the result at the end.',
    es: 'Construye un objeto complejo paso a paso con una API fluida y valida el resultado al final.',
    'pt-BR':
      'Constrói um objeto complexo passo a passo com uma API fluente e valida o resultado no final.',
  },
  when: {
    en: 'When an object has many optional fields or rules between them and a ten-parameter constructor would be unreadable.',
    es: 'Cuando un objeto tiene muchos campos opcionales o reglas entre ellos y un constructor con diez parámetros sería ilegible.',
    'pt-BR':
      'Quando um objeto tem muitos campos opcionais ou regras entre eles e um construtor com dez parâmetros seria ilegível.',
  },
  pros: {
    en: [
      'Readable, self-documenting creation code.',
      'Validation centralized in build().',
      'The same process can produce variants.',
    ],
    es: [
      'Código de creación legible y autodocumentado.',
      'Validación centralizada en build().',
      'El mismo proceso puede producir variantes.',
    ],
    'pt-BR': [
      'Código de criação legível e autodocumentado.',
      'Validação centralizada em build().',
      'O mesmo processo pode produzir variantes.',
    ],
  },
  cons: {
    en: [
      'More code than an object literal for simple cases.',
      'The half-built object can leak if it is not encapsulated well.',
    ],
    es: [
      'Más código que un literal de objeto para casos simples.',
      'El objeto a medio construir puede filtrarse si no se encapsula bien.',
    ],
    'pt-BR': [
      'Mais código que um literal de objeto para casos simples.',
      'O objeto pela metade pode vazar se não for bem encapsulado.',
    ],
  },
  realWorld: {
    en: "Knex and Drizzle query builders, Zod schemas (z.string().min(3)), supertest's API, URLSearchParams.",
    es: 'Los query builders de Knex y Drizzle, los schemas de Zod (z.string().min(3)), la API de supertest, URLSearchParams.',
    'pt-BR':
      'Os query builders do Knex e do Drizzle, os schemas do Zod (z.string().min(3)), a API do supertest, URLSearchParams.',
  },
  example: {
    title: {
      en: 'SQL query builder',
      es: 'Builder de consultas SQL',
      'pt-BR': 'Builder de consultas SQL',
    },
    scenario: {
      en: 'Report screens build queries with optional filters, sorting and limits. Concatenating strings by hand produced broken SQL and injection risks.',
      es: 'Las pantallas de reportes arman consultas con filtros, orden y límites opcionales. Concatenar strings a mano generaba SQL roto y riesgos de inyección.',
      'pt-BR':
        'As telas de relatórios montam consultas com filtros, ordenação e limites opcionais. Concatenar strings à mão gerava SQL quebrado e riscos de injeção.',
    },
    code: `class QueryBuilder {
  #table = null;
  #columns = ['*'];
  #where = [];
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
    this.#where.push(field + ' = ?');
    this.#params.push(value); // values never go into the SQL string
    return this;
  }
  limit(n) {
    this.#limit = n;
    return this;
  }

  build() {
    if (!this.#table) throw new Error('Missing table');
    let sql = 'SELECT ' + this.#columns.join(', ') + ' FROM ' + this.#table;
    if (this.#where.length) sql += ' WHERE ' + this.#where.join(' AND ');
    if (this.#limit) sql += ' LIMIT ' + this.#limit;
    return Object.freeze({ sql, params: [...this.#params] });
  }
}

const query = new QueryBuilder().from('orders').select('id', 'total').where('status', 'paid').limit(20).build();
console.log(query.sql); // SELECT id, total FROM orders WHERE status = ? LIMIT 20
console.log(query.params); // ['paid']`,
  },
  related: ['factory-method', 'abstract-factory', 'composite'],
};
