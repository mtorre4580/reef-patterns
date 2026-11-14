import type { Challenge } from '../../types';

export const builder1: Challenge = {
  id: 'builder-1',
  patternId: 'builder',
  title: { en: 'Dive plan', es: 'Plan de inmersión', 'pt-BR': 'Plano de mergulho' },
  difficulty: 'media',
  story: {
    en: 'Dive plans used to be built with a ten-field object literal and something was always missing. A plan using air at 40 m was even printed without a warning.',
    es: 'Los planes de inmersión se armaban con un objeto literal de diez campos y siempre faltaba algo. Un plan con aire a 40 m llegó a imprimirse sin advertencia.',
    'pt-BR':
      'Os planos de mergulho eram montados com um objeto literal de dez campos e sempre faltava algo. Um plano com ar a 40 m chegou a ser impresso sem aviso.',
  },
  instructions: {
    en: 'Implement `DivePlanBuilder` with chainable methods `site(name)`, `maxDepth(m)`, `nitrox(o2Percent)` (21 by default) and `stop(depth, minutes)`, and a `build()` that:\n- throws `Error("Missing site or depth")` if either is missing;\n- throws `Error("Unsafe gas at <m> m")` if `maxDepth` exceeds the MOD: `Math.floor((1.4 / (o2 / 100) - 1) * 10)`;\n- adds a `{ depth: 5, minutes: 3 }` stop if `maxDepth > 10` and there is no other stop at 5 m;\n- returns `{ site, maxDepth, o2, stops }` frozen with `Object.freeze`.',
    es: 'Implementá `DivePlanBuilder` con métodos encadenables `site(name)`, `maxDepth(m)`, `nitrox(o2Percent)` (por defecto 21) y `stop(depth, minutes)`, y `build()` que:\n- lanza `Error("Missing site or depth")` si falta alguno;\n- lanza `Error("Unsafe gas at <m> m")` si `maxDepth` supera la MOD: `Math.floor((1.4 / (o2 / 100) - 1) * 10)`;\n- agrega una parada `{ depth: 5, minutes: 3 }` si `maxDepth > 10` y no hay otra a 5 m;\n- devuelve `{ site, maxDepth, o2, stops }` congelado con `Object.freeze`.',
    'pt-BR':
      'Implemente `DivePlanBuilder` com métodos encadeáveis `site(name)`, `maxDepth(m)`, `nitrox(o2Percent)` (21 por padrão) e `stop(depth, minutes)`, e um `build()` que:\n- lança `Error("Missing site or depth")` se faltar algum;\n- lança `Error("Unsafe gas at <m> m")` se `maxDepth` passar da MOD: `Math.floor((1.4 / (o2 / 100) - 1) * 10)`;\n- adiciona uma parada `{ depth: 5, minutes: 3 }` se `maxDepth > 10` e não houver outra a 5 m;\n- devolve `{ site, maxDepth, o2, stops }` congelado com `Object.freeze`.',
  },
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
      name: {
        en: 'methods chain',
        es: 'los métodos se encadenan',
        'pt-BR': 'os métodos se encadeiam',
      },
      code: `const plan = new DivePlanBuilder().site('Hidden Reef').maxDepth(18).build();
expect(plan.site).toBe('Hidden Reef');
expect(plan.o2).toBe(21);`,
    },
    {
      name: {
        en: 'adds the safety stop',
        es: 'agrega la parada de seguridad',
        'pt-BR': 'adiciona a parada de segurança',
      },
      code: `const plan = new DivePlanBuilder().site('The Wall').maxDepth(24).nitrox(32).build();
expect(plan.stops).toEqual([{ depth: 5, minutes: 3 }]);`,
    },
    {
      name: {
        en: 'does not duplicate a 5 m stop',
        es: 'no duplica una parada a 5 m',
        'pt-BR': 'não duplica uma parada a 5 m',
      },
      code: `const plan = new DivePlanBuilder().site('Cave').maxDepth(20).stop(5, 5).build();
expect(plan.stops).toEqual([{ depth: 5, minutes: 5 }]);`,
    },
    {
      name: {
        en: 'rejects unsafe gas',
        es: 'rechaza gas inseguro',
        'pt-BR': 'rejeita gás inseguro',
      },
      code: `const builder = new DivePlanBuilder().site('Abyss').maxDepth(40).nitrox(32);
expect(() => builder.build()).toThrow('Unsafe gas at 40 m');`,
    },
    {
      name: {
        en: 'requires site and depth',
        es: 'exige sitio y profundidad',
        'pt-BR': 'exige local e profundidade',
      },
      code: `expect(() => new DivePlanBuilder().site('Only a site').build()).toThrow('Missing site or depth');`,
    },
    {
      name: {
        en: 'the plan is frozen',
        es: 'el plan queda congelado',
        'pt-BR': 'o plano fica congelado',
      },
      code: `const plan = new DivePlanBuilder().site('Shoal').maxDepth(8).build();
expect(Object.isFrozen(plan)).toBe(true);
expect(plan.stops).toEqual([]);`,
    },
  ],
  hints: {
    en: [
      'Each method stores its value and does `return this` so calls can chain.',
      'All validation goes into `build()`, once.',
      "Copy the stops array before adding the safety stop so you don't modify the builder's state.",
    ],
    es: [
      'Cada método guarda su dato y hace `return this` para poder encadenar.',
      'Toda la validación va en `build()`, una sola vez.',
      'Copiá el array de paradas antes de agregar la de seguridad para no modificar el estado del builder.',
    ],
    'pt-BR': [
      'Cada método guarda seu dado e faz `return this` para poder encadear.',
      'Toda a validação vai em `build()`, uma única vez.',
      'Copie o array de paradas antes de adicionar a de segurança para não modificar o estado do builder.',
    ],
  },
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
    if (!this.#site || !this.#maxDepth) throw new Error('Missing site or depth');
    const mod = Math.floor((1.4 / (this.#o2 / 100) - 1) * 10);
    if (this.#maxDepth > mod) throw new Error('Unsafe gas at ' + this.#maxDepth + ' m');
    const stops = [...this.#stops];
    if (this.#maxDepth > 10 && !stops.some((s) => s.depth === 5)) stops.push({ depth: 5, minutes: 3 });
    return Object.freeze({ site: this.#site, maxDepth: this.#maxDepth, o2: this.#o2, stops });
  }
}
`,
};
