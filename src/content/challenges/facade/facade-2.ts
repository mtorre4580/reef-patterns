import type { Challenge } from '../../types';

export const facade2: Challenge = {
  id: 'facade-2',
  patternId: 'facade',
  title: {
    en: 'Place an order in one call',
    es: 'Crear una orden en una llamada',
    'pt-BR': 'Criar um pedido em uma chamada',
  },
  difficulty: 'media',
  story: {
    en: 'Placing an order means checking stock, reserving it and charging the card. The web checkout, the mobile app and the admin panel repeat that choreography, each with a different bug.',
    es: 'Crear una orden implica verificar stock, reservarlo y cobrar la tarjeta. El checkout web, la app mobile y el panel de admin repiten esa coreografía, cada uno con un bug distinto.',
    'pt-BR':
      'Criar um pedido implica verificar o estoque, reservá-lo e cobrar o cartão. O checkout web, o app mobile e o painel de admin repetem essa coreografia, cada um com um bug diferente.',
  },
  instructions: {
    en: 'Implement `Checkout` with `constructor({ inventory, payments })` and `placeOrder(sku, qty, total)`:\n1. `inventory.check(sku, qty)` returns `{ ok }`. If it is not ok, throw `Error("Out of stock: <sku>")` without reserving or charging anything.\n2. `inventory.reserve(sku, qty)` returns a reservation id.\n3. `payments.charge(total)` returns the payment id. If it fails, call `inventory.release(reservationId)` and rethrow the error.\nReturn `{ sku, qty, reservationId, paymentId }`.',
    es: 'Implementá `Checkout` con `constructor({ inventory, payments })` y `placeOrder(sku, qty, total)`:\n1. `inventory.check(sku, qty)` devuelve `{ ok }`. Si no está ok, lanzá `Error("Out of stock: <sku>")` sin reservar ni cobrar nada.\n2. `inventory.reserve(sku, qty)` devuelve un id de reserva.\n3. `payments.charge(total)` devuelve el id del pago. Si falla, llamá a `inventory.release(reservationId)` y volvé a lanzar el error.\nDevolvé `{ sku, qty, reservationId, paymentId }`.',
    'pt-BR':
      'Implemente `Checkout` com `constructor({ inventory, payments })` e `placeOrder(sku, qty, total)`:\n1. `inventory.check(sku, qty)` devolve `{ ok }`. Se não estiver ok, lance `Error("Out of stock: <sku>")` sem reservar nem cobrar nada.\n2. `inventory.reserve(sku, qty)` devolve um id de reserva.\n3. `payments.charge(total)` devolve o id do pagamento. Se falhar, chame `inventory.release(reservationId)` e relance o erro.\nDevolva `{ sku, qty, reservationId, paymentId }`.',
  },
  starterCode: `class Checkout {
  constructor(services) {
    this.services = services;
  }

  placeOrder(sku, qty, total) {
    // Coordinate inventory and payments
  }
}
`,
  tests: [
    {
      name: {
        en: 'coordinates both services',
        es: 'coordina ambos servicios',
        'pt-BR': 'coordena os dois serviços',
      },
      code: `const inventory = { check: fn(() => ({ ok: true })), reserve: fn(() => 'res_7'), release: fn() };
const payments = { charge: fn(() => 'pay_12') };
const order = new Checkout({ inventory, payments }).placeOrder('MUG', 2, 24);
expect(order).toEqual({ sku: 'MUG', qty: 2, reservationId: 'res_7', paymentId: 'pay_12' });
expect(payments.charge.calls).toEqual([[24]]);`,
    },
    {
      name: {
        en: 'without stock nothing is reserved or charged',
        es: 'sin stock no se reserva ni se cobra nada',
        'pt-BR': 'sem estoque nada é reservado nem cobrado',
      },
      code: `const inventory = { check: fn(() => ({ ok: false })), reserve: fn(), release: fn() };
const payments = { charge: fn() };
const checkout = new Checkout({ inventory, payments });
expect(() => checkout.placeOrder('MUG', 5, 60)).toThrow('Out of stock: MUG');
expect(inventory.reserve).toHaveBeenCalledTimes(0);
expect(payments.charge).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'if the charge fails, the stock is released',
        es: 'si el cobro falla, se libera el stock',
        'pt-BR': 'se a cobrança falhar, o estoque é liberado',
      },
      code: `const inventory = { check: () => ({ ok: true }), reserve: () => 'res_9', release: fn() };
const payments = { charge: () => { throw new Error('Card declined'); } };
const checkout = new Checkout({ inventory, payments });
expect(() => checkout.placeOrder('MUG', 1, 12)).toThrow('Card declined');
expect(inventory.release.calls).toEqual([['res_9']]);`,
    },
  ],
  hints: {
    en: [
      'The facade only coordinates: each step is a call to a service.',
      'Wrap `payments.charge` in `try/catch`; in the `catch`, release the stock and `throw error`.',
    ],
    es: [
      'La fachada solo coordina: cada paso es una llamada a un servicio.',
      'Envolvé `payments.charge` en `try/catch`; en el `catch`, liberá el stock y hacé `throw error`.',
    ],
    'pt-BR': [
      'A fachada só coordena: cada passo é uma chamada a um serviço.',
      'Envolva `payments.charge` em `try/catch`; no `catch`, libere o estoque e faça `throw error`.',
    ],
  },
  solution: `class Checkout {
  constructor({ inventory, payments }) {
    this.inventory = inventory;
    this.payments = payments;
  }

  placeOrder(sku, qty, total) {
    if (!this.inventory.check(sku, qty).ok) throw new Error('Out of stock: ' + sku);
    const reservationId = this.inventory.reserve(sku, qty);
    try {
      const paymentId = this.payments.charge(total);
      return { sku, qty, reservationId, paymentId };
    } catch (error) {
      this.inventory.release(reservationId);
      throw error;
    }
  }
}
`,
};
