import type { Challenge } from '../../types';

export const observer1: Challenge = {
  id: 'observer-1',
  patternId: 'observer',
  title: 'Alarma de temperatura',
  difficulty: 'facil',
  story:
    'El sensor del sump mide la temperatura cada minuto. El calentador, la alarma y la app del celular tienen que enterarse de cada lectura, pero el sensor no debería conocer a ninguno de ellos.',
  instructions:
    'Implementá la clase `TemperatureSensor` con:\n' +
    '- `subscribe(listener)`: registra una función y devuelve otra función que, al llamarla, desuscribe a ese listener.\n' +
    '- `read(celsius)`: guarda la lectura y llama a cada listener con el valor.\n' +
    '- `get last`: devuelve la última lectura (o `null` si todavía no hubo ninguna).',
  starterCode: `class TemperatureSensor {
  subscribe(listener) {
    // Registrá el listener y devolvé una función para desuscribirlo
  }

  read(celsius) {
    // Avisá a todos los suscriptores
  }

  get last() {
    return null;
  }
}
`,
  tests: [
    {
      name: 'notifica la lectura a todos los suscriptores',
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
      name: 'un suscriptor desuscripto no recibe más lecturas',
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
      name: 'cada sensor tiene sus propios suscriptores',
      code: `const sump = new TemperatureSensor();
const display = new TemperatureSensor();
const listener = fn();
sump.subscribe(listener);
display.read(26);
expect(listener).toHaveBeenCalledTimes(0);`,
    },
    {
      name: 'recuerda la última lectura',
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
      message: 'Define la clase TemperatureSensor',
    },
  ],
  hints: [
    'Guardá los listeners en una colección dentro de la instancia, por ejemplo un `Set` en un campo privado `#listeners`.',
    '`subscribe` puede devolver una arrow function que haga `this.#listeners.delete(listener)`.',
    'En `read`, recorré la colección con `for…of` y llamá a cada listener con la lectura.',
  ],
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
