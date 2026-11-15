import type { Pattern } from '../types';

export const state: Pattern = {
  id: 'state',
  rank: 21,
  name: 'State',
  localName: { en: 'State', es: 'Estado', 'pt-BR': 'Estado' },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'An object changes its behavior based on its internal state, delegating to one object per state.',
    es: 'Un objeto cambia su comportamiento según su estado interno, delegando en un objeto por cada estado.',
    'pt-BR':
      'Um objeto muda seu comportamento conforme seu estado interno, delegando a um objeto por estado.',
  },
  when: {
    en: 'When an object has phases with different rules and valid transitions between them, and per-state ifs repeat in every method.',
    es: 'Cuando un objeto tiene fases con reglas distintas y transiciones válidas entre ellas, y los if por estado se repiten en cada método.',
    'pt-BR':
      'Quando um objeto tem fases com regras diferentes e transições válidas entre elas, e os if por estado se repetem em cada método.',
  },
  pros: {
    en: [
      'Invalid transitions become impossible or explicit.',
      'Each state is small and easy to read.',
      'Adding states does not touch the existing ones.',
    ],
    es: [
      'Las transiciones inválidas se vuelven imposibles o explícitas.',
      'Cada estado es pequeño y fácil de leer.',
      'Agregar estados no toca a los existentes.',
    ],
    'pt-BR': [
      'As transições inválidas ficam impossíveis ou explícitas.',
      'Cada estado é pequeno e fácil de ler.',
      'Adicionar estados não mexe nos existentes.',
    ],
  },
  cons: {
    en: [
      'Many classes or objects for simple machines.',
      'Transitions spread across states can be hard to visualize.',
    ],
    es: [
      'Muchas clases o objetos para máquinas simples.',
      'Las transiciones repartidas entre estados pueden ser difíciles de visualizar.',
    ],
    'pt-BR': [
      'Muitas classes ou objetos para máquinas simples.',
      'Transições espalhadas entre estados podem ser difíceis de visualizar.',
    ],
  },
  realWorld: {
    en: 'XState and finite state machines, the state of a Promise (pending, fulfilled, rejected), reducers with a status field.',
    es: 'XState y las máquinas de estados finitos, el estado de una Promise (pending, fulfilled, rejected), los reducers con un campo status.',
    'pt-BR':
      'XState e as máquinas de estados finitos, o estado de uma Promise (pending, fulfilled, rejected), os reducers com um campo status.',
  },
  example: {
    title: {
      en: 'Order lifecycle',
      es: 'Ciclo de vida de una orden',
      'pt-BR': 'Ciclo de vida de um pedido',
    },
    scenario: {
      en: 'An order goes from pending to paid, shipped and delivered. It can only be cancelled before shipping, and a bug once let unpaid orders ship.',
      es: 'Una orden pasa de pendiente a pagada, enviada y entregada. Solo se puede cancelar antes del envío, y un bug dejó salir órdenes sin pagar.',
      'pt-BR':
        'Um pedido passa de pendente a pago, enviado e entregue. Só pode ser cancelado antes do envio, e um bug já deixou sair pedidos sem pagamento.',
    },
    code: `const transitions = {
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

const order = new Order();
try {
  order.ship(); // shipping an unpaid order
} catch (error) {
  console.warn(error.message); // Cannot ship from pending
}
order.pay();
order.ship();
order.deliver();
console.log(order.history);`,
  },
  related: ['strategy', 'memento', 'flux'],
};
