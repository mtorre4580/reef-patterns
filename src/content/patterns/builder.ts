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
    title: { en: 'Dive plan', es: 'Plan de inmersión', 'pt-BR': 'Plano de mergulho' },
    scenario: {
      en: 'A dive plan needs a site and a maximum depth, and optionally gases and stops. If someone plans to go beyond 30 m on air, the plan must be rejected.',
      es: 'Un plan de inmersión necesita sitio y profundidad máxima, y opcionalmente gases y paradas. Si se planea pasar de 30 m con aire, el plan debe rechazarse.',
      'pt-BR':
        'Um plano de mergulho precisa de local e profundidade máxima e, opcionalmente, gases e paradas. Se alguém planeja passar de 30 m com ar, o plano deve ser rejeitado.',
    },
    code: `class DivePlanBuilder {
  #plan = { stops: [], gas: { o2: 21 } };

  site(name) {
    this.#plan.site = name;
    return this;
  }
  maxDepth(meters) {
    this.#plan.maxDepth = meters;
    return this;
  }
  nitrox(o2Percent) {
    this.#plan.gas = { o2: o2Percent };
    return this;
  }
  stop(depth, minutes) {
    this.#plan.stops.push({ depth, minutes });
    return this;
  }

  build() {
    const { site, maxDepth, gas, stops } = this.#plan;
    if (!site || !maxDepth) throw new Error('Missing site or maximum depth');
    const mod = Math.floor((1.4 / (gas.o2 / 100) - 1) * 10); // maximum operating depth
    if (maxDepth > mod) throw new Error('The gas is not safe at ' + maxDepth + ' m (MOD ' + mod + ' m)');
    if (maxDepth > 10 && !stops.some((s) => s.depth === 5)) stops.push({ depth: 5, minutes: 3 });
    return Object.freeze({ site, maxDepth, gas, stops });
  }
}

const plan = new DivePlanBuilder().site('Hidden Reef').maxDepth(24).nitrox(32).build();
console.log(plan.stops); // the 5 m safety stop was added`,
  },
  related: ['factory-method', 'abstract-factory', 'composite'],
};
