import type { Challenge } from '../../types';

export const strategy1: Challenge = {
  id: 'strategy-1',
  patternId: 'strategy',
  title: {
    en: 'Shipping cost calculator',
    es: 'Calculadora de costo de envío',
    'pt-BR': 'Calculadora de frete',
  },
  difficulty: 'media',
  story: {
    en: 'The checkout computes shipping with a switch over the method name. Every new option (express, pickup, free over a threshold) means editing the class, and last time someone broke standard shipping.',
    es: 'El checkout calcula el envío con un switch sobre el nombre del método. Cada opción nueva (express, retiro, gratis desde un monto) obliga a editar la clase, y la última vez alguien rompió el envío estándar.',
    'pt-BR':
      'O checkout calcula o frete com um switch sobre o nome do método. Cada opção nova (expresso, retirada, grátis acima de um valor) obriga a editar a classe, e da última vez alguém quebrou o frete padrão.',
  },
  instructions: {
    en: 'Rewrite `ShippingCalculator` so it receives a strategy:\n- Define `standard` and `express` as `{ name, cost(order) }` objects. Standard: `5 + order.weightKg * 1`; Express: `12 + order.weightKg * 2`.\n- `new ShippingCalculator(strategy)`, `setStrategy(strategy)` and `quote(order)`, which returns `{ method, cost }`.\n- It must work with any new strategy without modifying `ShippingCalculator`. No `switch` and at most one `if`.',
    es: 'Reescribí `ShippingCalculator` para que reciba una estrategia:\n- Definí `standard` y `express` como objetos `{ name, cost(order) }`. Standard: `5 + order.weightKg * 1`; Express: `12 + order.weightKg * 2`.\n- `new ShippingCalculator(strategy)`, `setStrategy(strategy)` y `quote(order)`, que devuelve `{ method, cost }`.\n- Tiene que funcionar con cualquier estrategia nueva sin modificar `ShippingCalculator`. Sin `switch` y como mucho un `if`.',
    'pt-BR':
      'Reescreva `ShippingCalculator` para receber uma estratégia:\n- Defina `standard` e `express` como objetos `{ name, cost(order) }`. Standard: `5 + order.weightKg * 1`; Express: `12 + order.weightKg * 2`.\n- `new ShippingCalculator(strategy)`, `setStrategy(strategy)` e `quote(order)`, que devolve `{ method, cost }`.\n- Precisa funcionar com qualquer estratégia nova sem modificar `ShippingCalculator`. Sem `switch` e no máximo um `if`.',
  },
  starterCode: `class ShippingCalculator {
  constructor(method) {
    this.method = method;
  }

  quote(order) {
    switch (this.method) {
      case 'standard':
        return { method: 'Standard', cost: 5 + order.weightKg * 1 };
      case 'express':
        return { method: 'Express', cost: 12 + order.weightKg * 2 };
    }
  }
}
`,
  tests: [
    {
      name: {
        en: 'standard computes the cost',
        es: 'standard calcula el costo',
        'pt-BR': 'standard calcula o custo',
      },
      code: `expect(new ShippingCalculator(standard).quote({ weightKg: 3 })).toEqual({ method: 'Standard', cost: 8 });`,
    },
    {
      name: {
        en: 'express computes the cost',
        es: 'express calcula el costo',
        'pt-BR': 'express calcula o custo',
      },
      code: `expect(new ShippingCalculator(express).quote({ weightKg: 3 })).toEqual({ method: 'Express', cost: 18 });`,
    },
    {
      name: {
        en: 'accepts a new strategy without modifying the calculator',
        es: 'acepta una estrategia nueva sin modificar la calculadora',
        'pt-BR': 'aceita uma estratégia nova sem modificar a calculadora',
      },
      code: `const pickup = { name: 'Store pickup', cost: () => 0 };
expect(new ShippingCalculator(pickup).quote({ weightKg: 10 })).toEqual({ method: 'Store pickup', cost: 0 });`,
    },
    {
      name: {
        en: 'setStrategy switches the method on the fly',
        es: 'setStrategy cambia el método en caliente',
        'pt-BR': 'setStrategy troca o método na hora',
      },
      code: `const calculator = new ShippingCalculator(standard);
calculator.setStrategy(express);
expect(calculator.quote({ weightKg: 1 }).method).toBe('Express');`,
    },
    {
      name: {
        en: 'delegates the calculation to the strategy',
        es: 'delega el cálculo en la estrategia',
        'pt-BR': 'delega o cálculo à estratégia',
      },
      code: `const cost = fn(() => 7);
const order = { weightKg: 2, subtotal: 40 };
const result = new ShippingCalculator({ name: 'Spy', cost }).quote(order);
expect(cost.calls).toEqual([[order]]);
expect(result.cost).toBe(7);`,
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
      'A strategy is just an object with the same shape: `name` and `cost(order)`.',
      'Store the strategy in the constructor and delegate in `quote`: `this.strategy.cost(order)`.',
      '`quote` can return `{ method: this.strategy.name, cost: this.strategy.cost(order) }`.',
    ],
    es: [
      'Una estrategia es solo un objeto con la misma forma: `name` y `cost(order)`.',
      'Guardá la estrategia en el constructor y delegá en `quote`: `this.strategy.cost(order)`.',
      '`quote` puede devolver `{ method: this.strategy.name, cost: this.strategy.cost(order) }`.',
    ],
    'pt-BR': [
      'Uma estratégia é só um objeto com o mesmo formato: `name` e `cost(order)`.',
      'Guarde a estratégia no construtor e delegue em `quote`: `this.strategy.cost(order)`.',
      '`quote` pode devolver `{ method: this.strategy.name, cost: this.strategy.cost(order) }`.',
    ],
  },
  solution: `const standard = {
  name: 'Standard',
  cost: (order) => 5 + order.weightKg * 1,
};

const express = {
  name: 'Express',
  cost: (order) => 12 + order.weightKg * 2,
};

class ShippingCalculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  quote(order) {
    return { method: this.strategy.name, cost: this.strategy.cost(order) };
  }
}
`,
};
