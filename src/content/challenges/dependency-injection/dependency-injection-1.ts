import type { Challenge } from '../../types';

export const dependencyInjection1: Challenge = {
  id: 'dependency-injection-1',
  patternId: 'dependency-injection',
  title: 'Monitor de pH testeable',
  difficulty: 'facil',
  story:
    'El monitor de pH crea su propia sonda y avisa con `console.warn`. En la notebook no hay sonda conectada, así que es imposible probarlo, y nadie se entera de las alertas.',
  instructions:
    'Refactorizá `PhMonitor` para recibir sus dependencias: `new PhMonitor({ sensor, notify })`.\n' +
    '- `check()` lee `sensor.read()`, y si el pH está fuera de `[7.9, 8.4]` llama a `notify("pH fuera de rango: <valor>")`.\n' +
    '- Devuelve el valor leído.',
  starterCode: `class RealProbe {
  read() {
    throw new Error('Sin sonda conectada');
  }
}

class PhMonitor {
  constructor() {
    this.sensor = new RealProbe();
  }

  check() {
    const ph = this.sensor.read();
    if (ph < 7.9 || ph > 8.4) console.warn('pH fuera de rango: ' + ph);
    return ph;
  }
}
`,
  tests: [
    {
      name: 'usa el sensor inyectado',
      code: `const monitor = new PhMonitor({ sensor: { read: () => 8.1 }, notify: fn() });
expect(monitor.check()).toBe(8.1);`,
    },
    {
      name: 'notifica cuando el pH está bajo',
      code: `const notify = fn();
new PhMonitor({ sensor: { read: () => 7.7 }, notify }).check();
expect(notify.calls).toEqual([['pH fuera de rango: 7.7']]);`,
    },
    {
      name: 'no notifica si está en rango',
      code: `const notify = fn();
const monitor = new PhMonitor({ sensor: { read: () => 8.4 }, notify });
monitor.check();
expect(notify).toHaveBeenCalledTimes(0);`,
    },
  ],
  hints: [
    'Recibí un objeto en el constructor y guardá `sensor` y `notify` como propiedades.',
    'Reemplazá `console.warn` por `this.notify`.',
  ],
  solution: `class RealProbe {
  read() {
    throw new Error('Sin sonda conectada');
  }
}

class PhMonitor {
  constructor({ sensor, notify }) {
    this.sensor = sensor;
    this.notify = notify;
  }

  check() {
    const ph = this.sensor.read();
    if (ph < 7.9 || ph > 8.4) this.notify('pH fuera de rango: ' + ph);
    return ph;
  }
}
`,
};
