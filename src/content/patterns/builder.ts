import type { Pattern } from '../types';

export const builder: Pattern = {
  id: 'builder',
  rank: 9,
  name: 'Builder',
  nameEs: 'Constructor',
  category: 'creacional',
  tier: 1,
  gof: true,
  summary:
    'Construye un objeto complejo paso a paso con una API fluida y valida el resultado al final.',
  when: 'Cuando un objeto tiene muchos campos opcionales o reglas entre ellos y un constructor con diez parámetros sería ilegible.',
  pros: [
    'Código de creación legible y autodocumentado.',
    'Validación centralizada en build().',
    'El mismo proceso puede producir variantes.',
  ],
  cons: [
    'Más código que un literal de objeto para casos simples.',
    'El objeto a medio construir puede filtrarse si no se encapsula bien.',
  ],
  realWorld:
    'Los query builders de Knex y Drizzle, los schemas de Zod (z.string().min(3)), la API de supertest, URLSearchParams.',
  example: {
    title: 'Plan de inmersión',
    scenario:
      'Un plan de inmersión necesita sitio y profundidad máxima, y opcionalmente gases y paradas. Si se planea pasar de 30 m con aire, el plan debe rechazarse.',
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
    if (!site || !maxDepth) throw new Error('Faltan sitio o profundidad máxima');
    const mod = Math.floor((1.4 / (gas.o2 / 100) - 1) * 10); // profundidad máxima operativa
    if (maxDepth > mod) throw new Error('El gas no es seguro a ' + maxDepth + ' m (MOD ' + mod + ' m)');
    if (maxDepth > 10 && !stops.some((s) => s.depth === 5)) stops.push({ depth: 5, minutes: 3 });
    return Object.freeze({ site, maxDepth, gas, stops });
  }
}

const plan = new DivePlanBuilder().site('Arrecife Escondido').maxDepth(24).nitrox(32).build();
console.log(plan.stops); // se agregó la parada de seguridad a 5 m`,
  },
  related: ['factory-method', 'abstract-factory', 'composite'],
};
