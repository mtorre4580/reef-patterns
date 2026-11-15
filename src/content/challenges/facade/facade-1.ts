import type { Challenge } from '../../types';

export const facade1: Challenge = {
  id: 'facade-1',
  patternId: 'facade',
  title: {
    en: 'App startup and shutdown',
    es: 'Arranque y apagado de la app',
    'pt-BR': 'Inicialização e desligamento do app',
  },
  difficulty: 'facil',
  story: {
    en: 'Starting the server means loading the config, connecting to the database and warming the cache, in that order, and stopping them in reverse. Last month someone warmed the cache before the database was connected.',
    es: 'Arrancar el servidor implica cargar la configuración, conectar la base y precalentar la caché, en ese orden, y apagarlos al revés. El mes pasado alguien precalentó la caché antes de conectar la base.',
    'pt-BR':
      'Iniciar o servidor implica carregar a configuração, conectar o banco e aquecer o cache, nessa ordem, e desligá-los ao contrário. No mês passado alguém aqueceu o cache antes de conectar o banco.',
  },
  instructions: {
    en: 'Implement `AppLifecycle` with `constructor({ config, db, cache })`:\n- `start()`: starts config, db and cache, in that order.\n- `stop()`: stops them in reverse order, but only the ones that were started. If `start()` was never called, it does nothing.\nEach service has `running`, `start()` and `stop()` (use `createService` to try it out).',
    es: 'Implementá `AppLifecycle` con `constructor({ config, db, cache })`:\n- `start()`: arranca config, db y cache, en ese orden.\n- `stop()`: los apaga en orden inverso, pero solo los que se arrancaron. Si nunca se llamó a `start()`, no hace nada.\nCada servicio tiene `running`, `start()` y `stop()` (usá `createService` para probar).',
    'pt-BR':
      'Implemente `AppLifecycle` com `constructor({ config, db, cache })`:\n- `start()`: inicia config, db e cache, nessa ordem.\n- `stop()`: desliga-os na ordem inversa, mas só os que foram iniciados. Se `start()` nunca foi chamado, não faz nada.\nCada serviço tem `running`, `start()` e `stop()` (use `createService` para testar).',
  },
  starterCode: `// Test service: logs every action into the shared log
function createService(name, log, { failOnStart = false } = {}) {
  return {
    name,
    running: false,
    start() {
      if (failOnStart) throw new Error(name + ' failed to start');
      this.running = true;
      log.push('start:' + name);
    },
    stop() { this.running = false; log.push('stop:' + name); },
  };
}

class AppLifecycle {
  constructor(services) {
    this.services = services;
  }

  start() {}

  stop() {}
}
`,
  tests: [
    {
      name: {
        en: 'starts in the safe order',
        es: 'arranca en el orden seguro',
        'pt-BR': 'inicia na ordem segura',
      },
      code: `const log = [];
const app = new AppLifecycle({
  config: createService('config', log),
  db: createService('db', log),
  cache: createService('cache', log),
});
app.start();
expect(log).toEqual(['start:config', 'start:db', 'start:cache']);`,
    },
    {
      name: {
        en: 'stops in reverse order',
        es: 'apaga en orden inverso',
        'pt-BR': 'desliga na ordem inversa',
      },
      code: `const log = [];
const app = new AppLifecycle({
  config: createService('config', log),
  db: createService('db', log),
  cache: createService('cache', log),
});
app.start();
log.length = 0;
app.stop();
expect(log).toEqual(['stop:cache', 'stop:db', 'stop:config']);`,
    },
    {
      name: {
        en: 'if a service fails, only the started ones are stopped',
        es: 'si un servicio falla, solo se apagan los que arrancaron',
        'pt-BR': 'se um serviço falha, só os iniciados são desligados',
      },
      code: `const log = [];
const app = new AppLifecycle({
  config: createService('config', log),
  db: createService('db', log, { failOnStart: true }),
  cache: createService('cache', log),
});
expect(() => app.start()).toThrow('db failed to start');
log.length = 0;
app.stop();
expect(log).toEqual(['stop:config']);`,
    },
    {
      name: {
        en: 'stop without start does nothing',
        es: 'stop sin start no hace nada',
        'pt-BR': 'stop sem start não faz nada',
      },
      code: `const log = [];
const app = new AppLifecycle({
  config: createService('config', log),
  db: createService('db', log),
  cache: createService('cache', log),
});
app.stop();
expect(log).toEqual([]);`,
    },
  ],
  hints: {
    en: [
      'Keep an array with the startup order: `[config, db, cache]`.',
      'Remember which services actually started (push each one after its `start()` succeeds).',
      'To stop, walk that list backwards with `toReversed()`.',
    ],
    es: [
      'Guardá un array con el orden de arranque: `[config, db, cache]`.',
      'Recordá qué servicios arrancaron de verdad (agregá cada uno después de que su `start()` funcione).',
      'Para apagar, recorré esa lista al revés con `toReversed()`.',
    ],
    'pt-BR': [
      'Guarde um array com a ordem de inicialização: `[config, db, cache]`.',
      'Lembre quais serviços realmente iniciaram (adicione cada um depois que o `start()` dele der certo).',
      'Para desligar, percorra essa lista ao contrário com `toReversed()`.',
    ],
  },
  solution: `// Test service: logs every action into the shared log
function createService(name, log, { failOnStart = false } = {}) {
  return {
    name,
    running: false,
    start() {
      if (failOnStart) throw new Error(name + ' failed to start');
      this.running = true;
      log.push('start:' + name);
    },
    stop() { this.running = false; log.push('stop:' + name); },
  };
}

class AppLifecycle {
  #order;
  #started = [];

  constructor({ config, db, cache }) {
    this.#order = [config, db, cache];
  }

  start() {
    for (const service of this.#order) {
      service.start();
      this.#started.push(service);
    }
  }

  stop() {
    for (const service of this.#started.toReversed()) service.stop();
    this.#started = [];
  }
}
`,
};
