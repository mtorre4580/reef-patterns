import type { Challenge } from '../../types';

export const builder2: Challenge = {
  id: 'builder-2',
  patternId: 'builder',
  title: {
    en: 'Saltwater recipe',
    es: 'Receta de agua salada',
    'pt-BR': 'Receita de água salgada',
  },
  difficulty: 'facil',
  story: {
    en: 'Preparing water for a change needs liters, salinity and temperature. Most people use 35 ppt and 25 °C, but quarantine tanks lower the salinity.',
    es: 'Preparar agua para un cambio requiere litros, salinidad y temperatura. La mayoría usa 35 ppt y 25 °C, pero en cuarentena se baja la salinidad.',
    'pt-BR':
      'Preparar água para uma troca exige litros, salinidade e temperatura. A maioria usa 35 ppt e 25 °C, mas na quarentena a salinidade é reduzida.',
  },
  instructions: {
    en: 'Implement `SaltMixBuilder` with `liters(n)`, `salinity(ppt)` and `temperature(c)`, all chainable, and a `build()` that:\n- requires `liters` (if missing, `Error("Specify the liters")`);\n- defaults to 35 ppt and 25 °C;\n- rejects salinities outside 30–37 ppt with `RangeError("Salinity out of range")`;\n- returns `{ liters, salinity, temperature, saltGrams }` with `saltGrams = Math.round(liters * salinity * 1.02)`.',
    es: 'Implementá `SaltMixBuilder` con `liters(n)`, `salinity(ppt)` y `temperature(c)`, todos encadenables, y `build()` que:\n- exige `liters` (si falta, `Error("Specify the liters")`);\n- usa 35 ppt y 25 °C por defecto;\n- rechaza salinidades fuera de 30–37 ppt con `RangeError("Salinity out of range")`;\n- devuelve `{ liters, salinity, temperature, saltGrams }` con `saltGrams = Math.round(liters * salinity * 1.02)`.',
    'pt-BR':
      'Implemente `SaltMixBuilder` com `liters(n)`, `salinity(ppt)` e `temperature(c)`, todos encadeáveis, e um `build()` que:\n- exige `liters` (se faltar, `Error("Specify the liters")`);\n- usa 35 ppt e 25 °C por padrão;\n- rejeita salinidades fora de 30–37 ppt com `RangeError("Salinity out of range")`;\n- devolve `{ liters, salinity, temperature, saltGrams }` com `saltGrams = Math.round(liters * salinity * 1.02)`.',
  },
  starterCode: `function saltMix(liters, salinity, temperature) {
  return { liters, salinity, temperature, saltGrams: liters * salinity };
}
`,
  tests: [
    {
      name: {
        en: 'uses default values',
        es: 'usa valores por defecto',
        'pt-BR': 'usa valores padrão',
      },
      code: `expect(new SaltMixBuilder().liters(20).build()).toEqual({
  liters: 20, salinity: 35, temperature: 25, saltGrams: 714,
});`,
    },
    {
      name: {
        en: 'allows configuring every parameter',
        es: 'permite configurar cada parámetro',
        'pt-BR': 'permite configurar cada parâmetro',
      },
      code: `const mix = new SaltMixBuilder().liters(10).salinity(31).temperature(24).build();
expect(mix).toEqual({ liters: 10, salinity: 31, temperature: 24, saltGrams: 316 });`,
    },
    {
      name: { en: 'requires the liters', es: 'exige los litros', 'pt-BR': 'exige os litros' },
      code: `expect(() => new SaltMixBuilder().salinity(35).build()).toThrow('Specify the liters');`,
    },
    {
      name: {
        en: 'validates the salinity',
        es: 'valida la salinidad',
        'pt-BR': 'valida a salinidade',
      },
      code: `expect(() => new SaltMixBuilder().liters(5).salinity(40).build()).toThrow('Salinity out of range');`,
    },
  ],
  hints: {
    en: [
      'Store each value in a field and return `this`.',
      'Validate everything together in `build()`.',
    ],
    es: ['Guardá cada valor en un campo y devolvé `this`.', 'Validá todo junto en `build()`.'],
    'pt-BR': ['Guarde cada valor em um campo e devolva `this`.', 'Valide tudo junto em `build()`.'],
  },
  solution: `class SaltMixBuilder {
  #liters = null;
  #salinity = 35;
  #temperature = 25;

  liters(n) {
    this.#liters = n;
    return this;
  }
  salinity(ppt) {
    this.#salinity = ppt;
    return this;
  }
  temperature(c) {
    this.#temperature = c;
    return this;
  }

  build() {
    if (!this.#liters) throw new Error('Specify the liters');
    if (this.#salinity < 30 || this.#salinity > 37) throw new RangeError('Salinity out of range');
    return {
      liters: this.#liters,
      salinity: this.#salinity,
      temperature: this.#temperature,
      saltGrams: Math.round(this.#liters * this.#salinity * 1.02),
    };
  }
}
`,
};
