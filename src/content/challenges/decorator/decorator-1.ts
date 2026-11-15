import type { Challenge } from '../../types';

export const decorator1: Challenge = {
  id: 'decorator-1',
  patternId: 'decorator',
  title: { en: 'Plan add-ons', es: 'Add-ons de un plan', 'pt-BR': 'Add-ons de um plano' },
  difficulty: 'facil',
  story: {
    en: 'The pricing page builds plans with optional add-ons: priority support and extra storage. A subclass per combination (ProWithSupportAndStorage…) no longer scales.',
    es: 'La página de precios arma planes con add-ons opcionales: soporte prioritario y almacenamiento extra. Una subclase por combinación (ProConSoporteYStorage…) ya no escala.',
    'pt-BR':
      'A página de preços monta planos com add-ons opcionais: suporte prioritário e armazenamento extra. Uma subclasse por combinação (ProComSuporteEStorage…) já não escala.',
  },
  instructions: {
    en: 'Given `basePlan` (with `features()` and `price()`), implement two decorators that return a new plan with the same interface, without modifying the original:\n- `withSupport(plan)`: appends `"priority support"` to `features()` and adds 10 to the price.\n- `withStorage(plan)`: appends `"100 GB storage"`, adds 5 and adds `hasStorage()`, which returns `true`.\nThey must combine in any order and with any plan.',
    es: 'Dado `basePlan` (con `features()` y `price()`), implementá dos decoradores que devuelvan un plan nuevo con la misma interfaz, sin modificar el original:\n- `withSupport(plan)`: suma `"priority support"` al final de `features()` y 10 al precio.\n- `withStorage(plan)`: suma `"100 GB storage"` y 5, y agrega `hasStorage()` que devuelve `true`.\nTienen que poder combinarse en cualquier orden y con cualquier plan.',
    'pt-BR':
      'Dado `basePlan` (com `features()` e `price()`), implemente dois decoradores que devolvam um plano novo com a mesma interface, sem modificar o original:\n- `withSupport(plan)`: adiciona `"priority support"` ao final de `features()` e 10 ao preço.\n- `withStorage(plan)`: adiciona `"100 GB storage"` e 5, e acrescenta `hasStorage()`, que devolve `true`.\nPrecisam poder ser combinados em qualquer ordem e com qualquer plano.',
  },
  starterCode: `const basePlan = {
  features: () => ['5 projects', 'email support'],
  price: () => 20,
};

function withSupport(plan) {
  plan.features = () => ['5 projects', 'email support', 'priority support'];
  return plan;
}

function withStorage(plan) {
  return plan;
}
`,
  tests: [
    {
      name: {
        en: 'withSupport adds the feature and its price',
        es: 'withSupport suma la feature y su precio',
        'pt-BR': 'withSupport adiciona a feature e seu preço',
      },
      code: `const plan = withSupport(basePlan);
expect(plan.features()).toEqual(['5 projects', 'email support', 'priority support']);
expect(plan.price()).toBe(30);`,
    },
    {
      name: {
        en: 'does not modify the original plan',
        es: 'no modifica el plan original',
        'pt-BR': 'não modifica o plano original',
      },
      code: `withStorage(withSupport(basePlan));
expect(basePlan.features()).toEqual(['5 projects', 'email support']);
expect(basePlan.price()).toBe(20);`,
    },
    {
      name: {
        en: 'they combine in any order',
        es: 'se combinan en cualquier orden',
        'pt-BR': 'combinam-se em qualquer ordem',
      },
      code: `const a = withStorage(withSupport(basePlan));
const b = withSupport(withStorage(basePlan));
expect(a.price()).toBe(35);
expect(b.price()).toBe(35);
expect(a.features().at(-1)).toBe('100 GB storage');
expect(b.features().at(-1)).toBe('priority support');
expect(b.hasStorage()).toBe(true);`,
    },
    {
      name: {
        en: 'works with any plan',
        es: 'funciona con cualquier plan',
        'pt-BR': 'funciona com qualquer plano',
      },
      code: `const freePlan = { features: () => ['1 project'], price: () => 0 };
expect(withSupport(freePlan).features()).toEqual(['1 project', 'priority support']);`,
    },
  ],
  hints: {
    en: [
      'Return a new object: `{ ...plan, features: () => [...plan.features(), "priority support"] }`.',
      "For the price, call the wrapped plan's: `price: () => plan.price() + 10`.",
    ],
    es: [
      'Devolvé un objeto nuevo: `{ ...plan, features: () => [...plan.features(), "priority support"] }`.',
      'Para el precio, llamá al del plan envuelto: `price: () => plan.price() + 10`.',
    ],
    'pt-BR': [
      'Devolva um objeto novo: `{ ...plan, features: () => [...plan.features(), "priority support"] }`.',
      'Para o preço, chame o do plano envolvido: `price: () => plan.price() + 10`.',
    ],
  },
  solution: `const basePlan = {
  features: () => ['5 projects', 'email support'],
  price: () => 20,
};

function withSupport(plan) {
  return {
    ...plan,
    features: () => [...plan.features(), 'priority support'],
    price: () => plan.price() + 10,
  };
}

function withStorage(plan) {
  return {
    ...plan,
    features: () => [...plan.features(), '100 GB storage'],
    price: () => plan.price() + 5,
    hasStorage: () => true,
  };
}
`,
};
