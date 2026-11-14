import type { Challenge } from '../../types';

export const adapter2: Challenge = {
  id: 'adapter-2',
  patternId: 'adapter',
  title: 'Sonda en Fahrenheit',
  difficulty: 'media',
  story:
    'Compramos una sonda importada que solo habla en °F y con su propia API. El monitor de la app espera un sensor con `read()` en °C y `subscribe()`. No podemos cambiar ni la sonda ni el monitor.',
  instructions:
    'Implementá la clase `CelsiusAdapter` que envuelve una `ImperialProbe`:\n' +
    '- `read()` devuelve la temperatura actual en °C, redondeada a 1 decimal: `+((f - 32) * 5 / 9).toFixed(1)`.\n' +
    '- `subscribe(listener)` llama al listener con cada lectura en °C y devuelve la función para desuscribirse de la sonda.',
  starterCode: `// API de la sonda: no la modifiques
class ImperialProbe {
  #fahrenheit = 77;
  #callbacks = new Set();
  getFahrenheit() {
    return this.#fahrenheit;
  }
  onReading(callback) {
    this.#callbacks.add(callback);
    return () => this.#callbacks.delete(callback);
  }
  emit(fahrenheit) {
    this.#fahrenheit = fahrenheit;
    this.#callbacks.forEach((cb) => cb(fahrenheit));
  }
}

class CelsiusAdapter {
  constructor(probe) {
    this.probe = probe;
  }

  read() {
    return this.probe.getFahrenheit();
  }

  subscribe(listener) {
    return this.probe.onReading(listener);
  }
}
`,
  tests: [
    {
      name: 'read convierte a °C',
      code: `const probe = new ImperialProbe();
expect(new CelsiusAdapter(probe).read()).toBe(25);
probe.emit(79.7);
expect(new CelsiusAdapter(probe).read()).toBe(26.5);`,
    },
    {
      name: 'subscribe entrega lecturas en °C',
      code: `const probe = new ImperialProbe();
const listener = fn();
new CelsiusAdapter(probe).subscribe(listener);
probe.emit(82.4);
expect(listener.calls).toEqual([[28]]);`,
    },
    {
      name: 'la desuscripción llega a la sonda',
      code: `const probe = new ImperialProbe();
const listener = fn();
const off = new CelsiusAdapter(probe).subscribe(listener);
off();
probe.emit(90);
expect(listener).toHaveBeenCalledTimes(0);`,
    },
    {
      name: 'la sonda sigue hablando en °F',
      code: `const probe = new ImperialProbe();
new CelsiusAdapter(probe).read();
expect(probe.getFahrenheit()).toBe(77);`,
    },
  ],
  checks: [
    { rule: 'requireClass', name: 'CelsiusAdapter', message: 'Define la clase CelsiusAdapter' },
  ],
  hints: [
    'Escribí una función `toCelsius(f)` y usala en los dos métodos.',
    'En `subscribe`, pasale a la sonda un callback propio que convierta y llame al listener.',
  ],
  solution: `// API de la sonda: no la modifiques
class ImperialProbe {
  #fahrenheit = 77;
  #callbacks = new Set();
  getFahrenheit() {
    return this.#fahrenheit;
  }
  onReading(callback) {
    this.#callbacks.add(callback);
    return () => this.#callbacks.delete(callback);
  }
  emit(fahrenheit) {
    this.#fahrenheit = fahrenheit;
    this.#callbacks.forEach((cb) => cb(fahrenheit));
  }
}

const toCelsius = (f) => +(((f - 32) * 5) / 9).toFixed(1);

class CelsiusAdapter {
  constructor(probe) {
    this.probe = probe;
  }

  read() {
    return toCelsius(this.probe.getFahrenheit());
  }

  subscribe(listener) {
    return this.probe.onReading((f) => listener(toCelsius(f)));
  }
}
`,
};
