import type { Challenge } from '../../types';

export const strategy1: Challenge = {
  id: 'strategy-1',
  patternId: 'strategy',
  title: 'Dosificadora con métodos intercambiables',
  difficulty: 'media',
  story:
    'La dosificadora calcula cuánto agregar por día según el método: kalkwasser o Balling. El código actual usa un switch y cada método nuevo obliga a tocar la clase. Hoy alguien quiere probar un método tipo Triton.',
  instructions:
    'Reescribí `Doser` para que reciba una estrategia:\n' +
    '- Definí `kalkwasser` y `balling` como objetos `{ name, dose(ppm, liters) }`. Kalkwasser: `Math.round(ppm * liters * 0.54)` ml; Balling: `Math.round(ppm * liters * 0.012)` ml.\n' +
    '- `new Doser(strategy)`, `setStrategy(strategy)` y `dailyDose(ppm, liters)` que devuelve `{ method, ml }`.\n' +
    '- Tiene que funcionar con cualquier estrategia nueva sin modificar `Doser`. Sin `switch` y como mucho un `if`.',
  starterCode: `class Doser {
  constructor(method) {
    this.method = method;
  }

  dailyDose(ppm, liters) {
    switch (this.method) {
      case 'kalkwasser':
        return { method: 'Kalkwasser', ml: Math.round(ppm * liters * 0.54) };
      case 'balling':
        return { method: 'Balling', ml: Math.round(ppm * liters * 0.012) };
    }
  }
}
`,
  tests: [
    {
      name: 'kalkwasser calcula la dosis diaria',
      code: `expect(new Doser(kalkwasser).dailyDose(10, 300)).toEqual({ method: 'Kalkwasser', ml: 1620 });`,
    },
    {
      name: 'balling calcula la dosis diaria',
      code: `expect(new Doser(balling).dailyDose(10, 300)).toEqual({ method: 'Balling', ml: 36 });`,
    },
    {
      name: 'acepta una estrategia nueva sin modificar Doser',
      code: `const triton = { name: 'Tipo Triton', dose: (ppm, liters) => ppm * liters };
expect(new Doser(triton).dailyDose(2, 3)).toEqual({ method: 'Tipo Triton', ml: 6 });`,
    },
    {
      name: 'setStrategy cambia el método en caliente',
      code: `const doser = new Doser(kalkwasser);
doser.setStrategy(balling);
expect(doser.dailyDose(5, 100).method).toBe('Balling');`,
    },
    {
      name: 'delega el cálculo en la estrategia',
      code: `const dose = fn(() => 7);
const result = new Doser({ name: 'Espía', dose }).dailyDose(4, 50);
expect(dose.calls).toEqual([[4, 50]]);
expect(result.ml).toBe(7);`,
    },
  ],
  checks: [
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: 'Sin switch: cada método es una estrategia',
    },
    { rule: 'maxIfStatements', max: 1, message: 'Como mucho un if' },
  ],
  hints: [
    'Una estrategia es solo un objeto con la misma forma: `name` y `dose(ppm, liters)`.',
    'Guardá la estrategia en el constructor y en `dailyDose` delegá: `this.strategy.dose(ppm, liters)`.',
    '`dailyDose` puede devolver `{ method: this.strategy.name, ml: this.strategy.dose(ppm, liters) }`.',
  ],
  solution: `const kalkwasser = {
  name: 'Kalkwasser',
  dose: (ppm, liters) => Math.round(ppm * liters * 0.54),
};

const balling = {
  name: 'Balling',
  dose: (ppm, liters) => Math.round(ppm * liters * 0.012),
};

class Doser {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  dailyDose(ppm, liters) {
    return { method: this.strategy.name, ml: this.strategy.dose(ppm, liters) };
  }
}
`,
};
