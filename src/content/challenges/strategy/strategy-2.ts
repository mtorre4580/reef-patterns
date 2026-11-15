import type { Challenge } from '../../types';

export const strategy2: Challenge = {
  id: 'strategy-2',
  patternId: 'strategy',
  title: {
    en: 'Discount strategies at checkout',
    es: 'Estrategias de descuento en el checkout',
    'pt-BR': 'Estratégias de desconto no checkout',
  },
  difficulty: 'facil',
  story: {
    en: 'The checkout applies discounts with a chain of ifs over the coupon type. Marketing invents a new kind of discount every month, and the total once went negative.',
    es: 'El checkout aplica descuentos con una cadena de if según el tipo de cupón. Marketing inventa un descuento nuevo cada mes, y una vez el total quedó negativo.',
    'pt-BR':
      'O checkout aplica descontos com uma cadeia de if conforme o tipo de cupom. O marketing inventa um desconto novo todo mês, e uma vez o total ficou negativo.',
  },
  instructions: {
    en: 'Implement:\n- `percentOff(pct)`: returns a discount `{ name, apply(subtotal) }` that takes `pct` % off.\n- `fixedOff(amount)`: takes a fixed `amount` off.\n- `Cart` with `constructor(discount)`, `setDiscount(discount)` and `total(subtotal)`, which never returns a negative number.\nNo `if` and no `switch`: picking the discount means picking the strategy.',
    es: 'Implementá:\n- `percentOff(pct)`: devuelve un descuento `{ name, apply(subtotal) }` que resta el `pct` %.\n- `fixedOff(amount)`: resta un monto fijo `amount`.\n- `Cart` con `constructor(discount)`, `setDiscount(discount)` y `total(subtotal)`, que nunca devuelve negativos.\nSin `if` ni `switch`: elegir el descuento es elegir la estrategia.',
    'pt-BR':
      'Implemente:\n- `percentOff(pct)`: devolve um desconto `{ name, apply(subtotal) }` que tira `pct` %.\n- `fixedOff(amount)`: tira um valor fixo `amount`.\n- `Cart` com `constructor(discount)`, `setDiscount(discount)` e `total(subtotal)`, que nunca devolve negativos.\nSem `if` nem `switch`: escolher o desconto é escolher a estratégia.',
  },
  starterCode: `class Cart {
  constructor(coupon) {
    this.coupon = coupon;
  }

  total(subtotal) {
    if (this.coupon.type === 'percent') return subtotal - (subtotal * this.coupon.value) / 100;
    if (this.coupon.type === 'fixed') return subtotal - this.coupon.value;
    return subtotal;
  }
}
`,
  tests: [
    {
      name: {
        en: 'percentage discount',
        es: 'descuento porcentual',
        'pt-BR': 'desconto percentual',
      },
      code: `expect(new Cart(percentOff(10)).total(200)).toBe(180);`,
    },
    {
      name: { en: 'fixed discount', es: 'descuento fijo', 'pt-BR': 'desconto fixo' },
      code: `expect(new Cart(fixedOff(15)).total(100)).toBe(85);`,
    },
    {
      name: {
        en: 'never returns a negative total',
        es: 'nunca devuelve un total negativo',
        'pt-BR': 'nunca devolve um total negativo',
      },
      code: `expect(new Cart(fixedOff(50)).total(30)).toBe(0);`,
    },
    {
      name: {
        en: 'accepts a new discount',
        es: 'acepta un descuento nuevo',
        'pt-BR': 'aceita um desconto novo',
      },
      code: `const buyOver100 = { name: 'Over 100', apply: (s) => s - 25 };
expect(new Cart(buyOver100).total(120)).toBe(95);`,
    },
    {
      name: {
        en: 'setDiscount changes the calculation',
        es: 'setDiscount cambia el cálculo',
        'pt-BR': 'setDiscount muda o cálculo',
      },
      code: `const cart = new Cart(percentOff(10));
cart.setDiscount(fixedOff(5));
expect(cart.total(50)).toBe(45);`,
    },
  ],
  checks: [
    {
      rule: 'maxIfStatements',
      max: 0,
      message: {
        en: 'No if: the discount decides, not the cart',
        es: 'Sin if: decide el descuento, no el carrito',
        'pt-BR': 'Sem if: quem decide é o desconto, não o carrinho',
      },
    },
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: { en: 'No switch', es: 'Sin switch', 'pt-BR': 'Sem switch' },
    },
  ],
  hints: {
    en: [
      'Each discount is an object with `apply(subtotal)`; the factories just build it.',
      '`percentOff(10)` can return `{ name: "10% off", apply: (s) => s - (s * 10) / 100 }`.',
      'To avoid negatives, use `Math.max(0, …)` in `total`.',
    ],
    es: [
      'Cada descuento es un objeto con `apply(subtotal)`; las fábricas solo lo arman.',
      '`percentOff(10)` puede devolver `{ name: "10% off", apply: (s) => s - (s * 10) / 100 }`.',
      'Para no devolver negativos, usá `Math.max(0, …)` en `total`.',
    ],
    'pt-BR': [
      'Cada desconto é um objeto com `apply(subtotal)`; as fábricas só o montam.',
      '`percentOff(10)` pode devolver `{ name: "10% off", apply: (s) => s - (s * 10) / 100 }`.',
      'Para não devolver negativos, use `Math.max(0, …)` em `total`.',
    ],
  },
  solution: `const percentOff = (pct) => ({
  name: pct + '% off',
  apply: (subtotal) => subtotal - (subtotal * pct) / 100,
});

const fixedOff = (amount) => ({
  name: amount + ' off',
  apply: (subtotal) => subtotal - amount,
});

class Cart {
  constructor(discount) {
    this.discount = discount;
  }

  setDiscount(discount) {
    this.discount = discount;
  }

  total(subtotal) {
    return Math.max(0, this.discount.apply(subtotal));
  }
}
`,
};
