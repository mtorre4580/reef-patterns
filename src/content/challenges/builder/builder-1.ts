import type { Challenge } from '../../types';

export const builder1: Challenge = {
  id: 'builder-1',
  patternId: 'builder',
  title: 'Plan de inmersión',
  difficulty: 'media',
  story:
    'Los planes de inmersión se armaban con un objeto literal de diez campos y siempre faltaba algo. Un plan con aire a 40 m llegó a imprimirse sin advertencia.',
  instructions:
    'Implementá `DivePlanBuilder` con métodos encadenables `site(name)`, `maxDepth(m)`, `nitrox(o2Percent)` (por defecto 21) y `stop(depth, minutes)`, y `build()` que:\n' +
    '- lanza `Error("Faltan sitio o profundidad")` si falta alguno;\n' +
    '- lanza `Error("Gas inseguro a <m> m")` si `maxDepth` supera la MOD: `Math.floor((1.4 / (o2 / 100) - 1) * 10)`;\n' +
    '- agrega una parada `{ depth: 5, minutes: 3 }` si `maxDepth > 10` y no hay otra a 5 m;\n' +
    '- devuelve `{ site, maxDepth, o2, stops }` congelado con `Object.freeze`.',
  starterCode: `class DivePlanBuilder {
  site(name) {
    this.siteName = name;
  }

  build() {
    return { site: this.siteName };
  }
}
`,
  tests: [
    {
      name: 'los métodos se encadenan',
      code: `const plan = new DivePlanBuilder().site('Arrecife Escondido').maxDepth(18).build();
expect(plan.site).toBe('Arrecife Escondido');
expect(plan.o2).toBe(21);`,
    },
    {
      name: 'agrega la parada de seguridad',
      code: `const plan = new DivePlanBuilder().site('La Pared').maxDepth(24).nitrox(32).build();
expect(plan.stops).toEqual([{ depth: 5, minutes: 3 }]);`,
    },
    {
      name: 'no duplica una parada a 5 m',
      code: `const plan = new DivePlanBuilder().site('Cueva').maxDepth(20).stop(5, 5).build();
expect(plan.stops).toEqual([{ depth: 5, minutes: 5 }]);`,
    },
    {
      name: 'rechaza gas inseguro',
      code: `const builder = new DivePlanBuilder().site('Abismo').maxDepth(40).nitrox(32);
expect(() => builder.build()).toThrow('Gas inseguro a 40 m');`,
    },
    {
      name: 'exige sitio y profundidad',
      code: `expect(() => new DivePlanBuilder().site('Solo sitio').build()).toThrow('Faltan sitio o profundidad');`,
    },
    {
      name: 'el plan queda congelado',
      code: `const plan = new DivePlanBuilder().site('Bajo').maxDepth(8).build();
expect(Object.isFrozen(plan)).toBe(true);
expect(plan.stops).toEqual([]);`,
    },
  ],
  hints: [
    'Cada método guarda su dato y hace `return this` para poder encadenar.',
    'Toda la validación va en `build()`, una sola vez.',
    'Copiá el array de paradas antes de agregar la de seguridad para no modificar el estado del builder.',
  ],
  solution: `class DivePlanBuilder {
  #site = null;
  #maxDepth = null;
  #o2 = 21;
  #stops = [];

  site(name) {
    this.#site = name;
    return this;
  }
  maxDepth(meters) {
    this.#maxDepth = meters;
    return this;
  }
  nitrox(o2Percent) {
    this.#o2 = o2Percent;
    return this;
  }
  stop(depth, minutes) {
    this.#stops.push({ depth, minutes });
    return this;
  }

  build() {
    if (!this.#site || !this.#maxDepth) throw new Error('Faltan sitio o profundidad');
    const mod = Math.floor((1.4 / (this.#o2 / 100) - 1) * 10);
    if (this.#maxDepth > mod) throw new Error('Gas inseguro a ' + this.#maxDepth + ' m');
    const stops = [...this.#stops];
    if (this.#maxDepth > 10 && !stops.some((s) => s.depth === 5)) stops.push({ depth: 5, minutes: 3 });
    return Object.freeze({ site: this.#site, maxDepth: this.#maxDepth, o2: this.#o2, stops });
  }
}
`,
};
