import type { Challenge } from '../../types';

export const state1: Challenge = {
  id: 'state-1',
  patternId: 'state',
  title: {
    en: 'Order lifecycle',
    es: 'Ciclo de vida de una orden',
    'pt-BR': 'Ciclo de vida de um pedido',
  },
  difficulty: 'media',
  story: {
    en: 'An order goes from pending to paid, shipped and delivered. The current code has an if per status in every method, and a bug let unpaid orders ship.',
    es: 'Una orden pasa de pendiente a pagada, enviada y entregada. El código actual tiene un if por estado en cada método, y un bug dejó salir órdenes sin pagar.',
    'pt-BR':
      'Um pedido passa de pendente a pago, enviado e entregue. O código atual tem um if por status em cada método, e um bug deixou sair pedidos sem pagamento.',
  },
  instructions: {
    en: 'Implement `Order` with `status` (starting at `"pending"`), a `history` array of `"<from> → <to>"` transitions and the methods `pay()`, `ship()`, `deliver()` and `cancel()`.\nValid transitions:\n- pending → pay → paid; pending → cancel → cancelled\n- paid → ship → shipped; paid → cancel → cancelled\n- shipped → deliver → delivered\nAny other one throws `Error("Cannot <action> from <status>")` and does not change the status.',
    es: 'Implementá `Order` con `status` (empieza en `"pending"`), un array `history` de transiciones `"<de> → <a>"` y los métodos `pay()`, `ship()`, `deliver()` y `cancel()`.\nTransiciones válidas:\n- pending → pay → paid; pending → cancel → cancelled\n- paid → ship → shipped; paid → cancel → cancelled\n- shipped → deliver → delivered\nCualquier otra lanza `Error("Cannot <acción> from <status>")` y no cambia el estado.',
    'pt-BR':
      'Implemente `Order` com `status` (começa em `"pending"`), um array `history` de transições `"<de> → <para>"` e os métodos `pay()`, `ship()`, `deliver()` e `cancel()`.\nTransições válidas:\n- pending → pay → paid; pending → cancel → cancelled\n- paid → ship → shipped; paid → cancel → cancelled\n- shipped → deliver → delivered\nQualquer outra lança `Error("Cannot <ação> from <status>")` e não muda o status.',
  },
  starterCode: `class Order {
  status = 'pending';
  history = [];

  pay() {
    this.status = 'paid';
  }
  ship() {
    this.status = 'shipped';
  }
  deliver() {
    this.status = 'delivered';
  }
  cancel() {
    this.status = 'cancelled';
  }
}
`,
  tests: [
    {
      name: { en: 'a complete order', es: 'una orden completa', 'pt-BR': 'um pedido completo' },
      code: `const order = new Order();
order.pay();
order.ship();
order.deliver();
expect(order.status).toBe('delivered');
expect(order.history).toEqual(['pending → paid', 'paid → shipped', 'shipped → delivered']);`,
    },
    {
      name: {
        en: 'an unpaid order cannot ship',
        es: 'una orden sin pagar no se puede enviar',
        'pt-BR': 'um pedido sem pagamento não pode ser enviado',
      },
      code: `const order = new Order();
expect(() => order.ship()).toThrow('Cannot ship from pending');
expect(order.status).toBe('pending');
expect(order.history).toEqual([]);`,
    },
    {
      name: {
        en: 'a paid order can be cancelled',
        es: 'una orden pagada se puede cancelar',
        'pt-BR': 'um pedido pago pode ser cancelado',
      },
      code: `const order = new Order();
order.pay();
order.cancel();
expect(order.status).toBe('cancelled');`,
    },
    {
      name: {
        en: 'a shipped order cannot be cancelled',
        es: 'una orden enviada no se puede cancelar',
        'pt-BR': 'um pedido enviado não pode ser cancelado',
      },
      code: `const order = new Order();
order.pay();
order.ship();
expect(() => order.cancel()).toThrow('Cannot cancel from shipped');`,
    },
  ],
  checks: [
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: {
        en: 'No switch per status',
        es: 'Sin switch por estado',
        'pt-BR': 'Sem switch por status',
      },
    },
    {
      rule: 'maxIfStatements',
      max: 1,
      message: {
        en: 'At most one if: transitions are data',
        es: 'Como mucho un if: las transiciones son datos',
        'pt-BR': 'No máximo um if: as transições são dados',
      },
    },
  ],
  hints: {
    en: [
      'Model the transitions as data: `{ pending: { pay: "paid", cancel: "cancelled" }, … }`.',
      'A private `#go(action)` method looks up the next status in that table and throws if it does not exist.',
      'Each public method just calls `this.#go("name")`.',
    ],
    es: [
      'Modelá las transiciones como datos: `{ pending: { pay: "paid", cancel: "cancelled" }, … }`.',
      'Un método privado `#go(action)` busca el próximo estado en esa tabla y lanza si no existe.',
      'Cada método público solo llama a `this.#go("nombre")`.',
    ],
    'pt-BR': [
      'Modele as transições como dados: `{ pending: { pay: "paid", cancel: "cancelled" }, … }`.',
      'Um método privado `#go(action)` busca o próximo status nessa tabela e lança se não existir.',
      'Cada método público só chama `this.#go("nome")`.',
    ],
  },
  solution: `const transitions = {
  pending: { pay: 'paid', cancel: 'cancelled' },
  paid: { ship: 'shipped', cancel: 'cancelled' },
  shipped: { deliver: 'delivered' },
  delivered: {},
  cancelled: {},
};

class Order {
  status = 'pending';
  history = [];

  #go(action) {
    const next = transitions[this.status][action];
    if (!next) throw new Error('Cannot ' + action + ' from ' + this.status);
    this.history.push(this.status + ' → ' + next);
    this.status = next;
  }

  pay() { this.#go('pay'); }
  ship() { this.#go('ship'); }
  deliver() { this.#go('deliver'); }
  cancel() { this.#go('cancel'); }
}
`,
};
