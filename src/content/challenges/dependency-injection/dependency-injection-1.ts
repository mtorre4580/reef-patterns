import type { Challenge } from '../../types';

export const dependencyInjection1: Challenge = {
  id: 'dependency-injection-1',
  patternId: 'dependency-injection',
  title: {
    en: 'A testable health check',
    es: 'Un health check testeable',
    'pt-BR': 'Um health check testável',
  },
  difficulty: 'facil',
  story: {
    en: 'The health check creates its own HTTP client and warns with `console.warn`. CI has no network, so it cannot be tested, and nobody notices slow responses.',
    es: 'El health check crea su propio cliente HTTP y avisa con `console.warn`. En CI no hay red, así que no se puede testear, y nadie se entera de las respuestas lentas.',
    'pt-BR':
      'O health check cria seu próprio cliente HTTP e avisa com `console.warn`. No CI não há rede, então não dá para testá-lo, e ninguém fica sabendo das respostas lentas.',
  },
  instructions: {
    en: 'Refactor `HealthCheck` to receive its dependencies: `new HealthCheck({ api, notify })`.\n- `run()` calls `api.ping()`, which returns the latency in ms. If it is above 500, call `notify("Slow API: <ms> ms")`.\n- It returns the latency.',
    es: 'Refactorizá `HealthCheck` para recibir sus dependencias: `new HealthCheck({ api, notify })`.\n- `run()` llama a `api.ping()`, que devuelve la latencia en ms. Si es mayor a 500, llamá a `notify("Slow API: <ms> ms")`.\n- Devuelve la latencia.',
    'pt-BR':
      'Refatore `HealthCheck` para receber suas dependências: `new HealthCheck({ api, notify })`.\n- `run()` chama `api.ping()`, que devolve a latência em ms. Se for maior que 500, chame `notify("Slow API: <ms> ms")`.\n- Devolve a latência.',
  },
  starterCode: `class RealApi {
  ping() {
    throw new Error('No network in tests');
  }
}

class HealthCheck {
  constructor() {
    this.api = new RealApi();
  }

  run() {
    const ms = this.api.ping();
    if (ms > 500) console.warn('Slow API: ' + ms + ' ms');
    return ms;
  }
}
`,
  tests: [
    {
      name: {
        en: 'uses the injected API',
        es: 'usa la API inyectada',
        'pt-BR': 'usa a API injetada',
      },
      code: `const check = new HealthCheck({ api: { ping: () => 120 }, notify: fn() });
expect(check.run()).toBe(120);`,
    },
    {
      name: {
        en: 'notifies when the API is slow',
        es: 'avisa cuando la API está lenta',
        'pt-BR': 'avisa quando a API está lenta',
      },
      code: `const notify = fn();
new HealthCheck({ api: { ping: () => 830 }, notify }).run();
expect(notify.calls).toEqual([['Slow API: 830 ms']]);`,
    },
    {
      name: {
        en: 'does not notify when it is fast',
        es: 'no avisa si responde rápido',
        'pt-BR': 'não avisa se responde rápido',
      },
      code: `const notify = fn();
new HealthCheck({ api: { ping: () => 500 }, notify }).run();
expect(notify).toHaveBeenCalledTimes(0);`,
    },
  ],
  hints: {
    en: [
      'Receive an object in the constructor and store `api` and `notify` as properties.',
      'Replace `console.warn` with `this.notify`.',
    ],
    es: [
      'Recibí un objeto en el constructor y guardá `api` y `notify` como propiedades.',
      'Reemplazá `console.warn` por `this.notify`.',
    ],
    'pt-BR': [
      'Receba um objeto no construtor e guarde `api` e `notify` como propriedades.',
      'Troque `console.warn` por `this.notify`.',
    ],
  },
  solution: `class RealApi {
  ping() {
    throw new Error('No network in tests');
  }
}

class HealthCheck {
  constructor({ api, notify }) {
    this.api = api;
    this.notify = notify;
  }

  run() {
    const ms = this.api.ping();
    if (ms > 500) this.notify('Slow API: ' + ms + ' ms');
    return ms;
  }
}
`,
};
