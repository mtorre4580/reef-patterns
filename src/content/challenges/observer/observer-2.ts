import type { Challenge } from '../../types';

export const observer2: Challenge = {
  id: 'observer-2',
  patternId: 'observer',
  title: {
    en: 'Feeder with one-time notifications',
    es: 'Alimentador con avisos de un solo uso',
    'pt-BR': 'Alimentador com avisos de uso único',
  },
  difficulty: 'media',
  story: {
    en: 'The automatic feeder announces every time it drops food. The skimmer always wants to know (to pause itself), but the camera only wants the next feeding to take a photo.',
    es: 'El alimentador automático avisa cada vez que larga comida. El skimmer quiere enterarse siempre (para pausarse), pero la cámara solo quiere la próxima alimentación para sacar una foto.',
    'pt-BR':
      'O alimentador automático avisa cada vez que solta comida. O skimmer quer saber sempre (para pausar), mas a câmera só quer a próxima alimentação para tirar uma foto.',
  },
  instructions: {
    en: 'Implement `FeedingTimer` with:\n- `subscribe(listener)`, which returns a function to unsubscribe.\n- `once(listener)`: the listener gets only the next notification and unsubscribes itself. It also returns a function to cancel it earlier.\n- `feed(grams)`: notifies the subscribers with the grams.\n- `get listenerCount`: the number of active subscribers.',
    es: 'Implementá `FeedingTimer` con:\n- `subscribe(listener)` que devuelve una función para desuscribirse.\n- `once(listener)`: el listener recibe solo la próxima notificación y se desuscribe solo. También devuelve una función para cancelarlo antes.\n- `feed(grams)`: notifica a los suscriptores con los gramos.\n- `get listenerCount`: cantidad de suscriptores activos.',
    'pt-BR':
      'Implemente `FeedingTimer` com:\n- `subscribe(listener)`, que devolve uma função para cancelar a inscrição.\n- `once(listener)`: o listener recebe só a próxima notificação e se desinscreve sozinho. Também devolve uma função para cancelá-lo antes.\n- `feed(grams)`: notifica os inscritos com os gramas.\n- `get listenerCount`: quantidade de inscritos ativos.',
  },
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
      name: {
        en: 'subscribe gets every feeding',
        es: 'subscribe recibe cada alimentación',
        'pt-BR': 'subscribe recebe cada alimentação',
      },
      code: `const timer = new FeedingTimer();
const skimmer = fn();
timer.subscribe(skimmer);
timer.feed(0.4);
timer.feed(0.6);
expect(skimmer.calls).toEqual([[0.4], [0.6]]);`,
    },
    {
      name: {
        en: 'once gets only the next one',
        es: 'once recibe solo la próxima',
        'pt-BR': 'once recebe só a próxima',
      },
      code: `const timer = new FeedingTimer();
const camera = fn();
timer.once(camera);
timer.feed(0.4);
timer.feed(0.6);
expect(camera.calls).toEqual([[0.4]]);
expect(timer.listenerCount).toBe(0);`,
    },
    {
      name: {
        en: 'once can be cancelled earlier',
        es: 'once se puede cancelar antes',
        'pt-BR': 'once pode ser cancelado antes',
      },
      code: `const timer = new FeedingTimer();
const camera = fn();
const cancel = timer.once(camera);
cancel();
timer.feed(1);
expect(camera).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'the unsubscribe function removes only that listener',
        es: 'la función de desuscripción quita solo a ese listener',
        'pt-BR': 'a função de cancelamento remove só esse listener',
      },
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
      name: {
        en: 'unsubscribing during a notification does not skip others',
        es: 'desuscribirse durante una notificación no saltea a otros',
        'pt-BR': 'cancelar durante uma notificação não pula os outros',
      },
      code: `const timer = new FeedingTimer();
const order = [];
timer.once(() => order.push('camera'));
timer.subscribe(() => order.push('skimmer'));
timer.feed(1);
expect(order).toEqual(['camera', 'skimmer']);`,
    },
  ],
  hints: {
    en: [
      'A `Set` avoids duplicates and deletes in O(1): `this.#listeners.delete(listener)`.',
      '`once` can subscribe a wrapper that first unsubscribes and then calls the original listener.',
      'To notify safely, iterate over a copy: `for (const l of [...this.#listeners])`.',
    ],
    es: [
      'Un `Set` evita duplicados y permite borrar en O(1): `this.#listeners.delete(listener)`.',
      '`once` puede suscribir un envoltorio que primero se desuscribe y después llama al listener original.',
      'Para notificar de forma segura, recorré una copia: `for (const l of [...this.#listeners])`.',
    ],
    'pt-BR': [
      'Um `Set` evita duplicados e remove em O(1): `this.#listeners.delete(listener)`.',
      '`once` pode inscrever um invólucro que primeiro se desinscreve e depois chama o listener original.',
      'Para notificar com segurança, percorra uma cópia: `for (const l of [...this.#listeners])`.',
    ],
  },
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
