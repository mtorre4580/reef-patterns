import type { Challenge } from '../../types';

export const observer1: Challenge = {
  id: 'observer-1',
  patternId: 'observer',
  title: {
    en: 'Cart that notifies the UI',
    es: 'Carrito que avisa a la UI',
    'pt-BR': 'Carrinho que avisa a UI',
  },
  difficulty: 'facil',
  story: {
    en: 'When an item is added to the cart, the header badge, the analytics tracker and the local storage sync need to know. Today the cart imports all three and calls them by hand.',
    es: 'Cuando se agrega un producto al carrito, el contador del header, el tracking de analytics y el guardado local tienen que enterarse. Hoy el carrito importa a los tres y los llama a mano.',
    'pt-BR':
      'Quando um produto é adicionado ao carrinho, o contador do header, o tracking de analytics e o salvamento local precisam saber. Hoje o carrinho importa os três e os chama à mão.',
  },
  instructions: {
    en: 'Implement the `CartStore` class with:\n- `subscribe(listener)`: registers a function and returns another function that unsubscribes that listener when called.\n- `add(product)`: adds the product and calls each listener with the updated items array.\n- `get items`: returns the current items (an empty array at first).',
    es: 'Implementá la clase `CartStore` con:\n- `subscribe(listener)`: registra una función y devuelve otra función que, al llamarla, desuscribe a ese listener.\n- `add(product)`: agrega el producto y llama a cada listener con el array actualizado de items.\n- `get items`: devuelve los items actuales (un array vacío al principio).',
    'pt-BR':
      'Implemente a classe `CartStore` com:\n- `subscribe(listener)`: registra uma função e devolve outra função que, ao ser chamada, cancela a inscrição desse listener.\n- `add(product)`: adiciona o produto e chama cada listener com o array atualizado de itens.\n- `get items`: devolve os itens atuais (um array vazio no começo).',
  },
  starterCode: `class CartStore {
  subscribe(listener) {
    // Register the listener and return a function that unsubscribes it
  }

  add(product) {
    // Notify every subscriber
  }

  get items() {
    return [];
  }
}
`,
  tests: [
    {
      name: {
        en: 'notifies every subscriber with the items',
        es: 'avisa a todos los suscriptores con los items',
        'pt-BR': 'avisa todos os inscritos com os itens',
      },
      code: `const cart = new CartStore();
const badge = fn();
const analytics = fn();
cart.subscribe(badge);
cart.subscribe(analytics);
cart.add({ sku: 'MUG' });
expect(badge.calls).toEqual([[[{ sku: 'MUG' }]]]);
expect(analytics).toHaveBeenCalledTimes(1);`,
    },
    {
      name: {
        en: 'an unsubscribed listener gets no more updates',
        es: 'un suscriptor desuscripto no recibe más cambios',
        'pt-BR': 'um inscrito cancelado não recebe mais mudanças',
      },
      code: `const cart = new CartStore();
const persist = fn();
const badge = fn();
const stop = cart.subscribe(persist);
cart.subscribe(badge);
cart.add({ sku: 'A' });
stop();
cart.add({ sku: 'B' });
expect(persist).toHaveBeenCalledTimes(1);
expect(badge).toHaveBeenCalledTimes(2);`,
    },
    {
      name: {
        en: 'each cart has its own subscribers',
        es: 'cada carrito tiene sus propios suscriptores',
        'pt-BR': 'cada carrinho tem seus próprios inscritos',
      },
      code: `const a = new CartStore();
const b = new CartStore();
const listener = fn();
a.subscribe(listener);
b.add({ sku: 'X' });
expect(listener).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'keeps the current items',
        es: 'guarda los items actuales',
        'pt-BR': 'guarda os itens atuais',
      },
      code: `const cart = new CartStore();
expect(cart.items).toEqual([]);
cart.add({ sku: 'A' });
cart.add({ sku: 'B' });
expect(cart.items.map((i) => i.sku)).toEqual(['A', 'B']);`,
    },
  ],
  checks: [
    {
      rule: 'requireClass',
      name: 'CartStore',
      message: {
        en: 'Defines the CartStore class',
        es: 'Define la clase CartStore',
        'pt-BR': 'Define a classe CartStore',
      },
    },
  ],
  hints: {
    en: [
      'Keep the listeners in a collection inside the instance, for example a `Set` in a private `#listeners` field.',
      '`subscribe` can return an arrow function that does `this.#listeners.delete(listener)`.',
      'In `add`, update the array and call each listener with it using `for…of`.',
    ],
    es: [
      'Guardá los listeners en una colección dentro de la instancia, por ejemplo un `Set` en un campo privado `#listeners`.',
      '`subscribe` puede devolver una arrow function que haga `this.#listeners.delete(listener)`.',
      'En `add`, actualizá el array y llamá a cada listener con él usando `for…of`.',
    ],
    'pt-BR': [
      'Guarde os listeners em uma coleção dentro da instância, por exemplo um `Set` em um campo privado `#listeners`.',
      '`subscribe` pode devolver uma arrow function que faça `this.#listeners.delete(listener)`.',
      'Em `add`, atualize o array e chame cada listener com ele usando `for…of`.',
    ],
  },
  solution: `class CartStore {
  #listeners = new Set();
  #items = [];

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  add(product) {
    this.#items = [...this.#items, product];
    for (const listener of this.#listeners) listener(this.#items);
  }

  get items() {
    return this.#items;
  }
}
`,
};
