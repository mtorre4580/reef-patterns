import type { Pattern } from '../types';

export const observer: Pattern = {
  id: 'observer',
  rank: 2,
  name: 'Observer',
  nameEs: 'Observador',
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary:
    'Un sujeto mantiene una lista de suscriptores y les avisa automáticamente cuando su estado cambia.',
  when: 'Cuando varias partes del sistema tienen que reaccionar a un cambio y no querés que el origen del cambio conozca a cada una.',
  pros: [
    'Desacopla al emisor de quienes reaccionan.',
    'Se agregan o quitan suscriptores en tiempo de ejecución.',
    'Base de la programación reactiva y de los sistemas de eventos.',
  ],
  cons: [
    'Si te olvidás de desuscribir, aparecen fugas de memoria.',
    'El orden de notificación no suele estar garantizado.',
    'Las cascadas de notificaciones son difíciles de depurar.',
  ],
  realWorld:
    'EventTarget y addEventListener, EventEmitter de Node, observables de RxJS, el store de Redux con subscribe.',
  example: {
    title: 'Sensor de temperatura con suscriptores',
    scenario:
      'El sensor del sump lee la temperatura cada minuto. El calentador, la alarma y la app del celular necesitan enterarse, pero el sensor no debería conocer a ninguno.',
    code: `class TemperatureSensor {
  #listeners = new Set();
  #celsius = null;

  subscribe(listener) {
    this.#listeners.add(listener);
    // Devolvemos la función para desuscribirse: evita fugas
    return () => this.#listeners.delete(listener);
  }

  read(celsius) {
    this.#celsius = celsius;
    for (const listener of this.#listeners) listener(celsius);
  }
}

const sensor = new TemperatureSensor();

const heater = (c) => console.log(c < 25 ? 'Calentador: encendido' : 'Calentador: apagado');
const alarm = (c) => c > 28 && console.warn('¡Alarma! Temperatura alta: ' + c + ' °C');
const phone = (c) => console.log('App: ' + c + ' °C');

sensor.subscribe(heater);
sensor.subscribe(alarm);
const stopPhone = sensor.subscribe(phone);

sensor.read(24.6); // los tres reaccionan
stopPhone(); // el usuario silenció la app
sensor.read(28.4); // solo calentador y alarma`,
  },
  related: ['pub-sub', 'mediator', 'flux'],
};
