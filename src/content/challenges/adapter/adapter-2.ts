import type { Challenge } from '../../types';

export const adapter2: Challenge = {
  id: 'adapter-2',
  patternId: 'adapter',
  title: {
    en: 'Wrapping a legacy analytics SDK',
    es: 'Envolver un SDK de analytics viejo',
    'pt-BR': 'Envolver um SDK de analytics antigo',
  },
  difficulty: 'media',
  story: {
    en: 'The app tracks events with `track(name, props)` and `identify(userId)`. Marketing signed with a vendor whose old SDK only has `logEvent({ name, data })` and `setUser({ id })`. We cannot change the SDK or the 200 calls in the app.',
    es: 'La app registra eventos con `track(name, props)` e `identify(userId)`. Marketing firmó con un proveedor cuyo SDK viejo solo tiene `logEvent({ name, data })` y `setUser({ id })`. No podemos cambiar el SDK ni las 200 llamadas de la app.',
    'pt-BR':
      'O app registra eventos com `track(name, props)` e `identify(userId)`. O marketing fechou com um fornecedor cujo SDK antigo só tem `logEvent({ name, data })` e `setUser({ id })`. Não podemos mudar o SDK nem as 200 chamadas do app.',
  },
  instructions: {
    en: 'Implement the `AnalyticsAdapter` class that wraps a `LegacySdk`:\n- `track(name, props = {})` calls `sdk.logEvent({ name, data: props })` and returns what it returns.\n- `identify(userId)` calls `sdk.setUser({ id: String(userId) })`.\n- `flush()` calls `sdk.sendNow()` and returns how many events were sent.',
    es: 'Implementá la clase `AnalyticsAdapter` que envuelve un `LegacySdk`:\n- `track(name, props = {})` llama a `sdk.logEvent({ name, data: props })` y devuelve lo que devuelva.\n- `identify(userId)` llama a `sdk.setUser({ id: String(userId) })`.\n- `flush()` llama a `sdk.sendNow()` y devuelve cuántos eventos se mandaron.',
    'pt-BR':
      'Implemente a classe `AnalyticsAdapter` que envolve um `LegacySdk`:\n- `track(name, props = {})` chama `sdk.logEvent({ name, data: props })` e devolve o que ela devolver.\n- `identify(userId)` chama `sdk.setUser({ id: String(userId) })`.\n- `flush()` chama `sdk.sendNow()` e devolve quantos eventos foram enviados.',
  },
  starterCode: `// Vendor SDK: do not modify it
class LegacySdk {
  queue = [];
  user = null;
  logEvent(event) {
    this.queue.push(event);
    return this.queue.length;
  }
  setUser(user) {
    this.user = user;
  }
  sendNow() {
    const sent = this.queue.length;
    this.queue = [];
    return sent;
  }
}

class AnalyticsAdapter {
  constructor(sdk) {
    this.sdk = sdk;
  }

  track(name, props) {
    return this.sdk.logEvent(name, props);
  }

  identify(userId) {
    this.sdk.setUser(userId);
  }
}
`,
  tests: [
    {
      name: {
        en: 'track translates to logEvent',
        es: 'track se traduce a logEvent',
        'pt-BR': 'track é traduzido para logEvent',
      },
      code: `const sdk = new LegacySdk();
const analytics = new AnalyticsAdapter(sdk);
analytics.track('checkout_started', { total: 59 });
analytics.track('page_view');
expect(sdk.queue).toEqual([{ name: 'checkout_started', data: { total: 59 } }, { name: 'page_view', data: {} }]);`,
    },
    {
      name: {
        en: 'identify translates to setUser with a string id',
        es: 'identify se traduce a setUser con un id string',
        'pt-BR': 'identify é traduzido para setUser com um id string',
      },
      code: `const sdk = new LegacySdk();
new AnalyticsAdapter(sdk).identify(42);
expect(sdk.user).toEqual({ id: '42' });`,
    },
    {
      name: {
        en: 'flush sends the queue',
        es: 'flush manda la cola',
        'pt-BR': 'flush envia a fila',
      },
      code: `const sdk = new LegacySdk();
const analytics = new AnalyticsAdapter(sdk);
analytics.track('a');
analytics.track('b');
expect(analytics.flush()).toBe(2);
expect(sdk.queue).toEqual([]);`,
    },
    {
      name: {
        en: 'works with any object that has the SDK shape',
        es: 'funciona con cualquier objeto con la forma del SDK',
        'pt-BR': 'funciona com qualquer objeto com o formato do SDK',
      },
      code: `const logEvent = fn(() => 1);
const adapter = new AnalyticsAdapter({ logEvent, setUser: fn(), sendNow: fn(() => 0) });
adapter.track('signup', { plan: 'pro' });
expect(logEvent.calls).toEqual([[{ name: 'signup', data: { plan: 'pro' } }]]);`,
    },
  ],
  checks: [
    {
      rule: 'requireClass',
      name: 'AnalyticsAdapter',
      message: {
        en: 'Defines the AnalyticsAdapter class',
        es: 'Define la clase AnalyticsAdapter',
        'pt-BR': 'Define a classe AnalyticsAdapter',
      },
    },
  ],
  hints: {
    en: [
      'The adapter keeps the app API and only translates each call into the SDK shape.',
      'Use a default parameter so `track("page_view")` sends `data: {}`.',
    ],
    es: [
      'El adaptador mantiene la API de la app y solo traduce cada llamada a la forma del SDK.',
      'Usá un parámetro por defecto para que `track("page_view")` mande `data: {}`.',
    ],
    'pt-BR': [
      'O adaptador mantém a API do app e só traduz cada chamada para o formato do SDK.',
      'Use um parâmetro padrão para que `track("page_view")` envie `data: {}`.',
    ],
  },
  solution: `// Vendor SDK: do not modify it
class LegacySdk {
  queue = [];
  user = null;
  logEvent(event) {
    this.queue.push(event);
    return this.queue.length;
  }
  setUser(user) {
    this.user = user;
  }
  sendNow() {
    const sent = this.queue.length;
    this.queue = [];
    return sent;
  }
}

class AnalyticsAdapter {
  constructor(sdk) {
    this.sdk = sdk;
  }

  track(name, props = {}) {
    return this.sdk.logEvent({ name, data: props });
  }

  identify(userId) {
    this.sdk.setUser({ id: String(userId) });
  }

  flush() {
    return this.sdk.sendNow();
  }
}
`,
};
