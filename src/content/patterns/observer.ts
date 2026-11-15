import type { Pattern } from '../types';

export const observer: Pattern = {
  id: 'observer',
  rank: 2,
  name: 'Observer',
  localName: { en: 'Observer', es: 'Observador', 'pt-BR': 'Observador' },
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary: {
    en: 'A subject keeps a list of subscribers and notifies them automatically when its state changes.',
    es: 'Un sujeto mantiene una lista de suscriptores y les avisa automáticamente cuando su estado cambia.',
    'pt-BR':
      'Um sujeito mantém uma lista de inscritos e os avisa automaticamente quando seu estado muda.',
  },
  when: {
    en: 'When several parts of the system need to react to a change and you do not want the source of the change to know each of them.',
    es: 'Cuando varias partes del sistema tienen que reaccionar a un cambio y no querés que el origen del cambio conozca a cada una.',
    'pt-BR':
      'Quando várias partes do sistema precisam reagir a uma mudança e você não quer que a origem da mudança conheça cada uma delas.',
  },
  pros: {
    en: [
      'Decouples the emitter from whoever reacts.',
      'Subscribers can be added or removed at runtime.',
      'The foundation of reactive programming and event systems.',
    ],
    es: [
      'Desacopla al emisor de quienes reaccionan.',
      'Se agregan o quitan suscriptores en tiempo de ejecución.',
      'Base de la programación reactiva y de los sistemas de eventos.',
    ],
    'pt-BR': [
      'Desacopla o emissor de quem reage.',
      'Inscritos podem ser adicionados ou removidos em tempo de execução.',
      'Base da programação reativa e dos sistemas de eventos.',
    ],
  },
  cons: {
    en: [
      'Forgetting to unsubscribe leaks memory.',
      'Notification order is usually not guaranteed.',
      'Notification cascades are hard to debug.',
    ],
    es: [
      'Si te olvidás de desuscribir, aparecen fugas de memoria.',
      'El orden de notificación no suele estar garantizado.',
      'Las cascadas de notificaciones son difíciles de depurar.',
    ],
    'pt-BR': [
      'Esquecer de cancelar a inscrição gera vazamentos de memória.',
      'A ordem das notificações costuma não ser garantida.',
      'Cascatas de notificações são difíceis de depurar.',
    ],
  },
  realWorld: {
    en: "EventTarget and addEventListener, Node's EventEmitter, RxJS observables, the Redux store with subscribe.",
    es: 'EventTarget y addEventListener, EventEmitter de Node, observables de RxJS, el store de Redux con subscribe.',
    'pt-BR':
      'EventTarget e addEventListener, o EventEmitter do Node, os observables do RxJS, o store do Redux com subscribe.',
  },
  example: {
    title: {
      en: 'Cart that notifies the UI',
      es: 'Carrito que avisa a la UI',
      'pt-BR': 'Carrinho que avisa a UI',
    },
    scenario: {
      en: 'When an item is added to the cart, the header badge, the analytics tracker and the local storage sync all need to know, but the cart should not know any of them.',
      es: 'Cuando se agrega un producto al carrito, el contador del header, el tracking de analytics y el guardado en localStorage tienen que enterarse, pero el carrito no debería conocer a ninguno.',
      'pt-BR':
        'Quando um produto é adicionado ao carrinho, o contador do header, o tracking de analytics e o salvamento local precisam saber, mas o carrinho não deveria conhecer nenhum deles.',
    },
    code: `class CartStore {
  #listeners = new Set();
  #items = [];

  subscribe(listener) {
    this.#listeners.add(listener);
    // Return the unsubscribe function: avoids leaks when a component unmounts
    return () => this.#listeners.delete(listener);
  }

  add(product) {
    this.#items = [...this.#items, product];
    for (const listener of this.#listeners) listener(this.#items);
  }
}

const cart = new CartStore();

const headerBadge = (items) => console.log('Badge: ' + items.length);
const analytics = (items) => console.log('track add_to_cart', items.at(-1).sku);
const persist = (items) => console.log('saved ' + items.length + ' items');

cart.subscribe(headerBadge);
cart.subscribe(analytics);
const stopPersisting = cart.subscribe(persist);

cart.add({ sku: 'TSHIRT-M', price: 20 }); // all three react
stopPersisting(); // the user disabled "remember my cart"
cart.add({ sku: 'MUG', price: 12 }); // only badge and analytics`,
  },
  related: ['pub-sub', 'mediator', 'flux'],
};
