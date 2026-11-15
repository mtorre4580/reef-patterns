import type { Challenge } from '../../types';

export const observer2: Challenge = {
  id: 'observer-2',
  patternId: 'observer',
  title: {
    en: 'Session events with one-time listeners',
    es: 'Eventos de sesión con listeners de un solo uso',
    'pt-BR': 'Eventos de sessão com listeners de uso único',
  },
  difficulty: 'media',
  story: {
    en: 'The auth module announces every token refresh. The API client always wants to know (to update its header), but the onboarding tour only wants the next one to start after login.',
    es: 'El módulo de autenticación avisa cada vez que se renueva el token. El cliente de API quiere enterarse siempre (para actualizar su header), pero el tour de bienvenida solo quiere el próximo para arrancar después del login.',
    'pt-BR':
      'O módulo de autenticação avisa toda vez que o token é renovado. O cliente de API quer saber sempre (para atualizar o header), mas o tour de boas-vindas só quer o próximo para começar depois do login.',
  },
  instructions: {
    en: 'Implement `TokenEvents` with:\n- `subscribe(listener)`, which returns a function to unsubscribe.\n- `once(listener)`: the listener gets only the next notification and unsubscribes itself. It also returns a function to cancel it earlier.\n- `refresh(token)`: notifies the subscribers with the token.\n- `get listenerCount`: the number of active subscribers.',
    es: 'Implementá `TokenEvents` con:\n- `subscribe(listener)`, que devuelve una función para desuscribirse.\n- `once(listener)`: el listener recibe solo la próxima notificación y se desuscribe solo. También devuelve una función para cancelarlo antes.\n- `refresh(token)`: notifica a los suscriptores con el token.\n- `get listenerCount`: cantidad de suscriptores activos.',
    'pt-BR':
      'Implemente `TokenEvents` com:\n- `subscribe(listener)`, que devolve uma função para cancelar a inscrição.\n- `once(listener)`: o listener recebe só a próxima notificação e se desinscreve sozinho. Também devolve uma função para cancelá-lo antes.\n- `refresh(token)`: notifica os inscritos com o token.\n- `get listenerCount`: quantidade de inscritos ativos.',
  },
  starterCode: `class TokenEvents {
  listeners = [];

  subscribe(listener) {
    this.listeners.push(listener);
  }

  once(listener) {
    this.listeners.push(listener);
  }

  refresh(token) {
    this.listeners.forEach((listener) => listener(token));
  }

  get listenerCount() {
    return this.listeners.length;
  }
}
`,
  tests: [
    {
      name: {
        en: 'subscribe gets every refresh',
        es: 'subscribe recibe cada renovación',
        'pt-BR': 'subscribe recebe cada renovação',
      },
      code: `const events = new TokenEvents();
const apiClient = fn();
events.subscribe(apiClient);
events.refresh('t1');
events.refresh('t2');
expect(apiClient.calls).toEqual([['t1'], ['t2']]);`,
    },
    {
      name: {
        en: 'once gets only the next one',
        es: 'once recibe solo la próxima',
        'pt-BR': 'once recebe só a próxima',
      },
      code: `const events = new TokenEvents();
const tour = fn();
events.once(tour);
events.refresh('t1');
events.refresh('t2');
expect(tour.calls).toEqual([['t1']]);
expect(events.listenerCount).toBe(0);`,
    },
    {
      name: {
        en: 'once can be cancelled earlier',
        es: 'once se puede cancelar antes',
        'pt-BR': 'once pode ser cancelado antes',
      },
      code: `const events = new TokenEvents();
const tour = fn();
const cancel = events.once(tour);
cancel();
events.refresh('t1');
expect(tour).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'the unsubscribe function removes only that listener',
        es: 'la función de desuscripción quita solo a ese listener',
        'pt-BR': 'a função de cancelamento remove só esse listener',
      },
      code: `const events = new TokenEvents();
const a = fn();
const b = fn();
const offA = events.subscribe(a);
events.subscribe(b);
offA();
events.refresh('t1');
expect(a).toHaveBeenCalledTimes(0);
expect(b).toHaveBeenCalledTimes(1);
expect(events.listenerCount).toBe(1);`,
    },
    {
      name: {
        en: 'unsubscribing during a notification does not skip others',
        es: 'desuscribirse durante una notificación no saltea a otros',
        'pt-BR': 'cancelar durante uma notificação não pula os outros',
      },
      code: `const events = new TokenEvents();
const order = [];
events.once(() => order.push('tour'));
events.subscribe(() => order.push('api'));
events.refresh('t1');
expect(order).toEqual(['tour', 'api']);`,
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
  solution: `class TokenEvents {
  #listeners = new Set();

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  once(listener) {
    const off = this.subscribe((token) => {
      off();
      listener(token);
    });
    return off;
  }

  refresh(token) {
    for (const listener of [...this.#listeners]) listener(token);
  }

  get listenerCount() {
    return this.#listeners.size;
  }
}
`,
};
