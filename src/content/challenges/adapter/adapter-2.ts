import type { Challenge } from '../../types';

export const adapter2: Challenge = {
  id: 'adapter-2',
  patternId: 'adapter',
  title: { en: 'Fahrenheit probe', es: 'Sonda en Fahrenheit', 'pt-BR': 'Sonda em Fahrenheit' },
  difficulty: 'media',
  story: {
    en: "We bought an imported probe that only speaks °F and has its own API. The app's monitor expects a sensor with `read()` in °C and `subscribe()`. We can change neither the probe nor the monitor.",
    es: 'Compramos una sonda importada que solo habla en °F y con su propia API. El monitor de la app espera un sensor con `read()` en °C y `subscribe()`. No podemos cambiar ni la sonda ni el monitor.',
    'pt-BR':
      'Compramos uma sonda importada que só fala em °F e tem sua própria API. O monitor do app espera um sensor com `read()` em °C e `subscribe()`. Não podemos mudar nem a sonda nem o monitor.',
  },
  instructions: {
    en: 'Implement the `CelsiusAdapter` class that wraps an `ImperialProbe`:\n- `read()` returns the current temperature in °C, rounded to 1 decimal: `+((f - 32) * 5 / 9).toFixed(1)`.\n- `subscribe(listener)` calls the listener with every reading in °C and returns the function that unsubscribes from the probe.',
    es: 'Implementá la clase `CelsiusAdapter` que envuelve una `ImperialProbe`:\n- `read()` devuelve la temperatura actual en °C, redondeada a 1 decimal: `+((f - 32) * 5 / 9).toFixed(1)`.\n- `subscribe(listener)` llama al listener con cada lectura en °C y devuelve la función para desuscribirse de la sonda.',
    'pt-BR':
      'Implemente a classe `CelsiusAdapter` que envolve uma `ImperialProbe`:\n- `read()` devolve a temperatura atual em °C, arredondada a 1 decimal: `+((f - 32) * 5 / 9).toFixed(1)`.\n- `subscribe(listener)` chama o listener com cada leitura em °C e devolve a função para cancelar a inscrição na sonda.',
  },
  starterCode: `// Probe API: do not modify it
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
      name: {
        en: 'read converts to °C',
        es: 'read convierte a °C',
        'pt-BR': 'read converte para °C',
      },
      code: `const probe = new ImperialProbe();
expect(new CelsiusAdapter(probe).read()).toBe(25);
probe.emit(79.7);
expect(new CelsiusAdapter(probe).read()).toBe(26.5);`,
    },
    {
      name: {
        en: 'subscribe delivers readings in °C',
        es: 'subscribe entrega lecturas en °C',
        'pt-BR': 'subscribe entrega leituras em °C',
      },
      code: `const probe = new ImperialProbe();
const listener = fn();
new CelsiusAdapter(probe).subscribe(listener);
probe.emit(82.4);
expect(listener.calls).toEqual([[28]]);`,
    },
    {
      name: {
        en: 'unsubscribing reaches the probe',
        es: 'la desuscripción llega a la sonda',
        'pt-BR': 'o cancelamento chega à sonda',
      },
      code: `const probe = new ImperialProbe();
const listener = fn();
const off = new CelsiusAdapter(probe).subscribe(listener);
off();
probe.emit(90);
expect(listener).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'the probe still speaks °F',
        es: 'la sonda sigue hablando en °F',
        'pt-BR': 'a sonda continua falando em °F',
      },
      code: `const probe = new ImperialProbe();
new CelsiusAdapter(probe).read();
expect(probe.getFahrenheit()).toBe(77);`,
    },
  ],
  checks: [
    {
      rule: 'requireClass',
      name: 'CelsiusAdapter',
      message: {
        en: 'Defines the CelsiusAdapter class',
        es: 'Define la clase CelsiusAdapter',
        'pt-BR': 'Define a classe CelsiusAdapter',
      },
    },
  ],
  hints: {
    en: [
      'Write a `toCelsius(f)` function and use it in both methods.',
      'In `subscribe`, give the probe your own callback that converts and calls the listener.',
    ],
    es: [
      'Escribí una función `toCelsius(f)` y usala en los dos métodos.',
      'En `subscribe`, pasale a la sonda un callback propio que convierta y llame al listener.',
    ],
    'pt-BR': [
      'Escreva uma função `toCelsius(f)` e use-a nos dois métodos.',
      'Em `subscribe`, passe para a sonda um callback próprio que converta e chame o listener.',
    ],
  },
  solution: `// Probe API: do not modify it
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
