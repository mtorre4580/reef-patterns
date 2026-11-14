import type { Challenge } from '../../types';

export const observer2: Challenge = {
  id: 'observer-2',
  patternId: 'observer',
  title: 'Alimentador con avisos de un solo uso',
  difficulty: 'media',
  story:
    'El alimentador automático avisa cada vez que larga comida. El skimmer quiere enterarse siempre (para pausarse), pero la cámara solo quiere la próxima alimentación para sacar una foto.',
  instructions:
    'Implementá `FeedingTimer` con:\n' +
    '- `subscribe(listener)` que devuelve una función para desuscribirse.\n' +
    '- `once(listener)`: el listener recibe solo la próxima notificación y se desuscribe solo. También devuelve una función para cancelarlo antes.\n' +
    '- `feed(grams)`: notifica a los suscriptores con los gramos.\n' +
    '- `get listenerCount`: cantidad de suscriptores activos.',
  starterCode: `class FeedingTimer {
  listeners = [];

  subscribe(listener) {
    this.listeners.push(listener);
  }

  once(listener) {
    this.listeners.push(listener);
  }

  feed(grams) {
    this.listeners.forEach((listener) => listener(grams));
  }

  get listenerCount() {
    return this.listeners.length;
  }
}
`,
  tests: [
    {
      name: 'subscribe recibe cada alimentación',
      code: `const timer = new FeedingTimer();
const skimmer = fn();
timer.subscribe(skimmer);
timer.feed(0.4);
timer.feed(0.6);
expect(skimmer.calls).toEqual([[0.4], [0.6]]);`,
    },
    {
      name: 'once recibe solo la próxima',
      code: `const timer = new FeedingTimer();
const camera = fn();
timer.once(camera);
timer.feed(0.4);
timer.feed(0.6);
expect(camera.calls).toEqual([[0.4]]);
expect(timer.listenerCount).toBe(0);`,
    },
    {
      name: 'once se puede cancelar antes',
      code: `const timer = new FeedingTimer();
const camera = fn();
const cancel = timer.once(camera);
cancel();
timer.feed(1);
expect(camera).toHaveBeenCalledTimes(0);`,
    },
    {
      name: 'la función de desuscripción quita solo a ese listener',
      code: `const timer = new FeedingTimer();
const a = fn();
const b = fn();
const offA = timer.subscribe(a);
timer.subscribe(b);
offA();
timer.feed(1);
expect(a).toHaveBeenCalledTimes(0);
expect(b).toHaveBeenCalledTimes(1);
expect(timer.listenerCount).toBe(1);`,
    },
    {
      name: 'desuscribirse durante una notificación no saltea a otros',
      code: `const timer = new FeedingTimer();
const order = [];
timer.once(() => order.push('cámara'));
timer.subscribe(() => order.push('skimmer'));
timer.feed(1);
expect(order).toEqual(['cámara', 'skimmer']);`,
    },
  ],
  hints: [
    'Un `Set` evita duplicados y permite borrar en O(1): `this.#listeners.delete(listener)`.',
    '`once` puede suscribir un envoltorio que primero se desuscribe y después llama al listener original.',
    'Para notificar de forma segura, recorré una copia: `for (const l of [...this.#listeners])`.',
  ],
  solution: `class FeedingTimer {
  #listeners = new Set();

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  once(listener) {
    const off = this.subscribe((grams) => {
      off();
      listener(grams);
    });
    return off;
  }

  feed(grams) {
    for (const listener of [...this.#listeners]) listener(grams);
  }

  get listenerCount() {
    return this.#listeners.size;
  }
}
`,
};
