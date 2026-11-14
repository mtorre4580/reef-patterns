import type { Challenge } from '../../types';

export const observer1: Challenge = {
  id: 'observer-1',
  patternId: 'observer',
  title: { en: 'Temperature alarm', es: 'Alarma de temperatura', 'pt-BR': 'Alarme de temperatura' },
  difficulty: 'facil',
  story: {
    en: 'The sump sensor measures the temperature every minute. The heater, the alarm and the phone app need to hear about every reading, but the sensor should not know any of them.',
    es: 'El sensor del sump mide la temperatura cada minuto. El calentador, la alarma y la app del celular tienen que enterarse de cada lectura, pero el sensor no debería conocer a ninguno de ellos.',
    'pt-BR':
      'O sensor do sump mede a temperatura a cada minuto. O aquecedor, o alarme e o app do celular precisam saber de cada leitura, mas o sensor não deveria conhecer nenhum deles.',
  },
  instructions: {
    en: 'Implement the `TemperatureSensor` class with:\n- `subscribe(listener)`: registers a function and returns another function that unsubscribes that listener when called.\n- `read(celsius)`: stores the reading and calls each listener with the value.\n- `get last`: returns the last reading (or `null` if there has not been one yet).',
    es: 'Implementá la clase `TemperatureSensor` con:\n- `subscribe(listener)`: registra una función y devuelve otra función que, al llamarla, desuscribe a ese listener.\n- `read(celsius)`: guarda la lectura y llama a cada listener con el valor.\n- `get last`: devuelve la última lectura (o `null` si todavía no hubo ninguna).',
    'pt-BR':
      'Implemente a classe `TemperatureSensor` com:\n- `subscribe(listener)`: registra uma função e devolve outra função que, ao ser chamada, cancela a inscrição desse listener.\n- `read(celsius)`: guarda a leitura e chama cada listener com o valor.\n- `get last`: devolve a última leitura (ou `null` se ainda não houve nenhuma).',
  },
  starterCode: `class TemperatureSensor {
  subscribe(listener) {
    // Register the listener and return a function that unsubscribes it
  }

  read(celsius) {
    // Notify every subscriber
  }

  get last() {
    return null;
  }
}
`,
  tests: [
    {
      name: {
        en: 'notifies the reading to every subscriber',
        es: 'notifica la lectura a todos los suscriptores',
        'pt-BR': 'notifica a leitura a todos os inscritos',
      },
      code: `const sensor = new TemperatureSensor();
const heater = fn();
const alarm = fn();
sensor.subscribe(heater);
sensor.subscribe(alarm);
sensor.read(25.4);
expect(heater.calls).toEqual([[25.4]]);
expect(alarm.calls).toEqual([[25.4]]);`,
    },
    {
      name: {
        en: 'an unsubscribed listener gets no more readings',
        es: 'un suscriptor desuscripto no recibe más lecturas',
        'pt-BR': 'um inscrito cancelado não recebe mais leituras',
      },
      code: `const sensor = new TemperatureSensor();
const phone = fn();
const heater = fn();
const stop = sensor.subscribe(phone);
sensor.subscribe(heater);
sensor.read(24);
stop();
sensor.read(29);
expect(phone).toHaveBeenCalledTimes(1);
expect(heater).toHaveBeenCalledTimes(2);`,
    },
    {
      name: {
        en: 'each sensor has its own subscribers',
        es: 'cada sensor tiene sus propios suscriptores',
        'pt-BR': 'cada sensor tem seus próprios inscritos',
      },
      code: `const sump = new TemperatureSensor();
const display = new TemperatureSensor();
const listener = fn();
sump.subscribe(listener);
display.read(26);
expect(listener).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'remembers the last reading',
        es: 'recuerda la última lectura',
        'pt-BR': 'lembra a última leitura',
      },
      code: `const sensor = new TemperatureSensor();
expect(sensor.last).toBe(null);
sensor.read(25);
sensor.read(25.8);
expect(sensor.last).toBe(25.8);`,
    },
  ],
  checks: [
    {
      rule: 'requireClass',
      name: 'TemperatureSensor',
      message: {
        en: 'Defines the TemperatureSensor class',
        es: 'Define la clase TemperatureSensor',
        'pt-BR': 'Define a classe TemperatureSensor',
      },
    },
  ],
  hints: {
    en: [
      'Keep the listeners in a collection inside the instance, for example a `Set` in a private `#listeners` field.',
      '`subscribe` can return an arrow function that does `this.#listeners.delete(listener)`.',
      'In `read`, loop over the collection with `for…of` and call each listener with the reading.',
    ],
    es: [
      'Guardá los listeners en una colección dentro de la instancia, por ejemplo un `Set` en un campo privado `#listeners`.',
      '`subscribe` puede devolver una arrow function que haga `this.#listeners.delete(listener)`.',
      'En `read`, recorré la colección con `for…of` y llamá a cada listener con la lectura.',
    ],
    'pt-BR': [
      'Guarde os listeners em uma coleção dentro da instância, por exemplo um `Set` em um campo privado `#listeners`.',
      '`subscribe` pode devolver uma arrow function que faça `this.#listeners.delete(listener)`.',
      'Em `read`, percorra a coleção com `for…of` e chame cada listener com a leitura.',
    ],
  },
  solution: `class TemperatureSensor {
  #listeners = new Set();
  #last = null;

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  read(celsius) {
    this.#last = celsius;
    for (const listener of this.#listeners) listener(celsius);
  }

  get last() {
    return this.#last;
  }
}
`,
};
