import type { Challenge } from '../../types';

export const strategy1: Challenge = {
  id: 'strategy-1',
  patternId: 'strategy',
  title: {
    en: 'Doser with interchangeable methods',
    es: 'Dosificadora con métodos intercambiables',
    'pt-BR': 'Dosadora com métodos intercambiáveis',
  },
  difficulty: 'media',
  story: {
    en: 'The doser computes how much to add per day depending on the method: kalkwasser or Balling. The current code uses a switch and every new method means touching the class. Today someone wants to try a Triton-style method.',
    es: 'La dosificadora calcula cuánto agregar por día según el método: kalkwasser o Balling. El código actual usa un switch y cada método nuevo obliga a tocar la clase. Hoy alguien quiere probar un método tipo Triton.',
    'pt-BR':
      'A dosadora calcula quanto adicionar por dia conforme o método: kalkwasser ou Balling. O código atual usa um switch e cada método novo obriga a mexer na classe. Hoje alguém quer testar um método tipo Triton.',
  },
  instructions: {
    en: 'Rewrite `Doser` so it receives a strategy:\n- Define `kalkwasser` and `balling` as `{ name, dose(ppm, liters) }` objects. Kalkwasser: `Math.round(ppm * liters * 0.54)` ml; Balling: `Math.round(ppm * liters * 0.012)` ml.\n- `new Doser(strategy)`, `setStrategy(strategy)` and `dailyDose(ppm, liters)`, which returns `{ method, ml }`.\n- It must work with any new strategy without modifying `Doser`. No `switch` and at most one `if`.',
    es: 'Reescribí `Doser` para que reciba una estrategia:\n- Definí `kalkwasser` y `balling` como objetos `{ name, dose(ppm, liters) }`. Kalkwasser: `Math.round(ppm * liters * 0.54)` ml; Balling: `Math.round(ppm * liters * 0.012)` ml.\n- `new Doser(strategy)`, `setStrategy(strategy)` y `dailyDose(ppm, liters)` que devuelve `{ method, ml }`.\n- Tiene que funcionar con cualquier estrategia nueva sin modificar `Doser`. Sin `switch` y como mucho un `if`.',
    'pt-BR':
      'Reescreva `Doser` para que receba uma estratégia:\n- Defina `kalkwasser` e `balling` como objetos `{ name, dose(ppm, liters) }`. Kalkwasser: `Math.round(ppm * liters * 0.54)` ml; Balling: `Math.round(ppm * liters * 0.012)` ml.\n- `new Doser(strategy)`, `setStrategy(strategy)` e `dailyDose(ppm, liters)`, que devolve `{ method, ml }`.\n- Precisa funcionar com qualquer estratégia nova sem modificar `Doser`. Sem `switch` e no máximo um `if`.',
  },
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
      name: {
        en: 'kalkwasser computes the daily dose',
        es: 'kalkwasser calcula la dosis diaria',
        'pt-BR': 'kalkwasser calcula a dose diária',
      },
      code: `expect(new Doser(kalkwasser).dailyDose(10, 300)).toEqual({ method: 'Kalkwasser', ml: 1620 });`,
    },
    {
      name: {
        en: 'balling computes the daily dose',
        es: 'balling calcula la dosis diaria',
        'pt-BR': 'balling calcula a dose diária',
      },
      code: `expect(new Doser(balling).dailyDose(10, 300)).toEqual({ method: 'Balling', ml: 36 });`,
    },
    {
      name: {
        en: 'accepts a new strategy without modifying Doser',
        es: 'acepta una estrategia nueva sin modificar Doser',
        'pt-BR': 'aceita uma estratégia nova sem modificar Doser',
      },
      code: `const triton = { name: 'Triton-style', dose: (ppm, liters) => ppm * liters };
expect(new Doser(triton).dailyDose(2, 3)).toEqual({ method: 'Triton-style', ml: 6 });`,
    },
    {
      name: {
        en: 'setStrategy switches the method on the fly',
        es: 'setStrategy cambia el método en caliente',
        'pt-BR': 'setStrategy troca o método na hora',
      },
      code: `const doser = new Doser(kalkwasser);
doser.setStrategy(balling);
expect(doser.dailyDose(5, 100).method).toBe('Balling');`,
    },
    {
      name: {
        en: 'delegates the calculation to the strategy',
        es: 'delega el cálculo en la estrategia',
        'pt-BR': 'delega o cálculo à estratégia',
      },
      code: `const dose = fn(() => 7);
const result = new Doser({ name: 'Spy', dose }).dailyDose(4, 50);
expect(dose.calls).toEqual([[4, 50]]);
expect(result.ml).toBe(7);`,
    },
  ],
  checks: [
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: {
        en: 'No switch: each method is a strategy',
        es: 'Sin switch: cada método es una estrategia',
        'pt-BR': 'Sem switch: cada método é uma estratégia',
      },
    },
    {
      rule: 'maxIfStatements',
      max: 1,
      message: { en: 'At most one if', es: 'Como mucho un if', 'pt-BR': 'No máximo um if' },
    },
  ],
  hints: {
    en: [
      'A strategy is just an object with the same shape: `name` and `dose(ppm, liters)`.',
      'Store the strategy in the constructor and delegate in `dailyDose`: `this.strategy.dose(ppm, liters)`.',
      '`dailyDose` can return `{ method: this.strategy.name, ml: this.strategy.dose(ppm, liters) }`.',
    ],
    es: [
      'Una estrategia es solo un objeto con la misma forma: `name` y `dose(ppm, liters)`.',
      'Guardá la estrategia en el constructor y en `dailyDose` delegá: `this.strategy.dose(ppm, liters)`.',
      '`dailyDose` puede devolver `{ method: this.strategy.name, ml: this.strategy.dose(ppm, liters) }`.',
    ],
    'pt-BR': [
      'Uma estratégia é só um objeto com o mesmo formato: `name` e `dose(ppm, liters)`.',
      'Guarde a estratégia no construtor e delegue em `dailyDose`: `this.strategy.dose(ppm, liters)`.',
      '`dailyDose` pode devolver `{ method: this.strategy.name, ml: this.strategy.dose(ppm, liters) }`.',
    ],
  },
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
