import type { Challenge } from '../../types';

export const dependencyInjection1: Challenge = {
  id: 'dependency-injection-1',
  patternId: 'dependency-injection',
  title: {
    en: 'A testable pH monitor',
    es: 'Monitor de pH testeable',
    'pt-BR': 'Monitor de pH testável',
  },
  difficulty: 'facil',
  story: {
    en: "The pH monitor creates its own probe and warns with `console.warn`. There's no probe connected to the laptop, so it can't be tested, and nobody notices the alerts.",
    es: 'El monitor de pH crea su propia sonda y avisa con `console.warn`. En la notebook no hay sonda conectada, así que es imposible probarlo, y nadie se entera de las alertas.',
    'pt-BR':
      'O monitor de pH cria sua própria sonda e avisa com `console.warn`. No notebook não há sonda conectada, então é impossível testá-lo, e ninguém fica sabendo dos alertas.',
  },
  instructions: {
    en: 'Refactor `PhMonitor` to receive its dependencies: `new PhMonitor({ sensor, notify })`.\n- `check()` reads `sensor.read()`, and if the pH is outside `[7.9, 8.4]` calls `notify("pH out of range: <value>")`.\n- It returns the value it read.',
    es: 'Refactorizá `PhMonitor` para recibir sus dependencias: `new PhMonitor({ sensor, notify })`.\n- `check()` lee `sensor.read()`, y si el pH está fuera de `[7.9, 8.4]` llama a `notify("pH out of range: <valor>")`.\n- Devuelve el valor leído.',
    'pt-BR':
      'Refatore `PhMonitor` para receber suas dependências: `new PhMonitor({ sensor, notify })`.\n- `check()` lê `sensor.read()` e, se o pH estiver fora de `[7.9, 8.4]`, chama `notify("pH out of range: <valor>")`.\n- Devolve o valor lido.',
  },
  starterCode: `class RealProbe {
  read() {
    throw new Error('No probe connected');
  }
}

class PhMonitor {
  constructor() {
    this.sensor = new RealProbe();
  }

  check() {
    const ph = this.sensor.read();
    if (ph < 7.9 || ph > 8.4) console.warn('pH out of range: ' + ph);
    return ph;
  }
}
`,
  tests: [
    {
      name: {
        en: 'uses the injected sensor',
        es: 'usa el sensor inyectado',
        'pt-BR': 'usa o sensor injetado',
      },
      code: `const monitor = new PhMonitor({ sensor: { read: () => 8.1 }, notify: fn() });
expect(monitor.check()).toBe(8.1);`,
    },
    {
      name: {
        en: 'notifies when the pH is low',
        es: 'notifica cuando el pH está bajo',
        'pt-BR': 'notifica quando o pH está baixo',
      },
      code: `const notify = fn();
new PhMonitor({ sensor: { read: () => 7.7 }, notify }).check();
expect(notify.calls).toEqual([['pH out of range: 7.7']]);`,
    },
    {
      name: {
        en: 'does not notify when in range',
        es: 'no notifica si está en rango',
        'pt-BR': 'não notifica se estiver na faixa',
      },
      code: `const notify = fn();
const monitor = new PhMonitor({ sensor: { read: () => 8.4 }, notify });
monitor.check();
expect(notify).toHaveBeenCalledTimes(0);`,
    },
  ],
  hints: {
    en: [
      'Receive an object in the constructor and store `sensor` and `notify` as properties.',
      'Replace `console.warn` with `this.notify`.',
    ],
    es: [
      'Recibí un objeto en el constructor y guardá `sensor` y `notify` como propiedades.',
      'Reemplazá `console.warn` por `this.notify`.',
    ],
    'pt-BR': [
      'Receba um objeto no construtor e guarde `sensor` e `notify` como propriedades.',
      'Troque `console.warn` por `this.notify`.',
    ],
  },
  solution: `class RealProbe {
  read() {
    throw new Error('No probe connected');
  }
}

class PhMonitor {
  constructor({ sensor, notify }) {
    this.sensor = sensor;
    this.notify = notify;
  }

  check() {
    const ph = this.sensor.read();
    if (ph < 7.9 || ph > 8.4) this.notify('pH out of range: ' + ph);
    return ph;
  }
}
`,
};
