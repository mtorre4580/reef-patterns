import type { Pattern } from '../types';

export const strategy: Pattern = {
  id: 'strategy',
  rank: 1,
  name: 'Strategy',
  localName: { en: 'Strategy', es: 'Estrategia', 'pt-BR': 'Estratégia' },
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary: {
    en: 'Wraps interchangeable algorithms behind the same interface so one can be picked at runtime.',
    es: 'Encapsula algoritmos intercambiables detrás de una misma interfaz para elegir uno en tiempo de ejecución.',
    'pt-BR':
      'Encapsula algoritmos intercambiáveis atrás de uma mesma interface para escolher um em tempo de execução.',
  },
  when: {
    en: 'When you have several ways of doing the same thing (computing, sorting, validating) and today you choose between them with a switch or an if chain that grows with every new case.',
    es: 'Cuando tenés varias formas de hacer lo mismo (calcular, ordenar, validar) y hoy las elegís con un switch o una cadena de if que crece con cada caso nuevo.',
    'pt-BR':
      'Quando você tem várias formas de fazer a mesma coisa (calcular, ordenar, validar) e hoje escolhe entre elas com um switch ou uma cadeia de if que cresce a cada caso novo.',
  },
  pros: {
    en: [
      'Adding a new variant does not touch the code that uses it (open/closed).',
      'Each algorithm is tested in isolation.',
      'Removes long, repeated conditionals.',
    ],
    es: [
      'Agregar una variante nueva no toca el código que la usa (abierto/cerrado).',
      'Cada algoritmo se testea aislado.',
      'Elimina condicionales largos y repetidos.',
    ],
    'pt-BR': [
      'Adicionar uma variante nova não mexe no código que a usa (aberto/fechado).',
      'Cada algoritmo é testado isoladamente.',
      'Elimina condicionais longos e repetidos.',
    ],
  },
  cons: {
    en: [
      'More moving parts for cases that will never change.',
      'The client has to know the strategies to pick one.',
    ],
    es: [
      'Más piezas sueltas para casos que nunca van a cambiar.',
      'El cliente tiene que conocer las estrategias para elegir una.',
    ],
    'pt-BR': [
      'Mais peças soltas para casos que nunca vão mudar.',
      'O cliente precisa conhecer as estratégias para escolher uma.',
    ],
  },
  realWorld: {
    en: "The comparator in Array.prototype.sort, Passport's authentication strategies, validation resolvers in react-hook-form.",
    es: 'Comparadores de Array.prototype.sort, estrategias de autenticación de Passport, resolvers de validación en react-hook-form.',
    'pt-BR':
      'O comparador de Array.prototype.sort, as estratégias de autenticação do Passport, os resolvers de validação do react-hook-form.',
  },
  example: {
    title: {
      en: 'Shipping cost at checkout',
      es: 'Costo de envío en el checkout',
      'pt-BR': 'Custo de frete no checkout',
    },
    scenario: {
      en: 'The checkout offers standard, express and store pickup. Marketing wants to add a "free over $50" option next week without touching the checkout code.',
      es: 'El checkout ofrece envío estándar, express y retiro en tienda. Marketing quiere sumar "gratis desde $50" la semana que viene sin tocar el código del checkout.',
      'pt-BR':
        'O checkout oferece frete padrão, expresso e retirada na loja. O marketing quer adicionar "grátis acima de $50" na semana que vem sem mexer no código do checkout.',
    },
    code: `// Each strategy receives the order and returns the shipping cost
const standard = { name: 'Standard', cost: (order) => 5 + order.weightKg * 0.8 };
const express = { name: 'Express', cost: (order) => 15 + order.weightKg * 1.5 };
const pickup = { name: 'Store pickup', cost: () => 0 };

class ShippingCalculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  quote(order) {
    // The calculator does not know which method it uses: it just delegates
    return { method: this.strategy.name, cost: +this.strategy.cost(order).toFixed(2) };
  }
}

const order = { subtotal: 42, weightKg: 2 };
const calculator = new ShippingCalculator(standard);
console.log(calculator.quote(order)); // { method: 'Standard', cost: 6.6 }

calculator.setStrategy(express); // the user picked express delivery
console.log(calculator.quote(order)); // { method: 'Express', cost: 18 }

// A new option is just a new object: the calculator stays untouched
const freeOver50 = { name: 'Free over $50', cost: (o) => (o.subtotal >= 50 ? 0 : 5) };
calculator.setStrategy(freeOver50);
console.log(calculator.quote(order));`,
  },
  related: ['state', 'template-method', 'dependency-injection'],
};
