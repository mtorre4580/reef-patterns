import type { Challenge } from '../../types';

export const builder2: Challenge = {
  id: 'builder-2',
  patternId: 'builder',
  title: 'Receta de agua salada',
  difficulty: 'facil',
  story:
    'Preparar agua para un cambio requiere litros, salinidad y temperatura. La mayoría usa 35 ppt y 25 °C, pero en cuarentena se baja la salinidad.',
  instructions:
    'Implementá `SaltMixBuilder` con `liters(n)`, `salinity(ppt)` y `temperature(c)`, todos encadenables, y `build()` que:\n' +
    '- exige `liters` (si falta, `Error("Indicá los litros")`);\n' +
    '- usa 35 ppt y 25 °C por defecto;\n' +
    '- rechaza salinidades fuera de 30–37 ppt con `RangeError("Salinidad fuera de rango")`;\n' +
    '- devuelve `{ liters, salinity, temperature, saltGrams }` con `saltGrams = Math.round(liters * salinity * 1.02)`.',
  starterCode: `function saltMix(liters, salinity, temperature) {
  return { liters, salinity, temperature, saltGrams: liters * salinity };
}
`,
  tests: [
    {
      name: 'usa valores por defecto',
      code: `expect(new SaltMixBuilder().liters(20).build()).toEqual({
  liters: 20, salinity: 35, temperature: 25, saltGrams: 714,
});`,
    },
    {
      name: 'permite configurar cada parámetro',
      code: `const mix = new SaltMixBuilder().liters(10).salinity(31).temperature(24).build();
expect(mix).toEqual({ liters: 10, salinity: 31, temperature: 24, saltGrams: 316 });`,
    },
    {
      name: 'exige los litros',
      code: `expect(() => new SaltMixBuilder().salinity(35).build()).toThrow('Indicá los litros');`,
    },
    {
      name: 'valida la salinidad',
      code: `expect(() => new SaltMixBuilder().liters(5).salinity(40).build()).toThrow('Salinidad fuera de rango');`,
    },
  ],
  hints: ['Guardá cada valor en un campo y devolvé `this`.', 'Validá todo junto en `build()`.'],
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
    if (!this.#liters) throw new Error('Indicá los litros');
    if (this.#salinity < 30 || this.#salinity > 37) throw new RangeError('Salinidad fuera de rango');
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
