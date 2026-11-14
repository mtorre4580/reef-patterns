import type { Pattern } from '../types';

export const observer: Pattern = {
  id: 'observer',
  rank: 2,
  name: 'Observer',
  localName: { en: 'Observer', es: 'Observador', 'pt-BR': 'Observador' },
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary: {
    en: 'A subject keeps a list of subscribers and notifies them automatically when its state changes.',
    es: 'Un sujeto mantiene una lista de suscriptores y les avisa automáticamente cuando su estado cambia.',
    'pt-BR':
      'Um sujeito mantém uma lista de inscritos e os avisa automaticamente quando seu estado muda.',
  },
  when: {
    en: 'When several parts of the system need to react to a change and you do not want the source of the change to know each of them.',
    es: 'Cuando varias partes del sistema tienen que reaccionar a un cambio y no querés que el origen del cambio conozca a cada una.',
    'pt-BR':
      'Quando várias partes do sistema precisam reagir a uma mudança e você não quer que a origem da mudança conheça cada uma delas.',
  },
  pros: {
    en: [
      'Decouples the emitter from whoever reacts.',
      'Subscribers can be added or removed at runtime.',
      'The foundation of reactive programming and event systems.',
    ],
    es: [
      'Desacopla al emisor de quienes reaccionan.',
      'Se agregan o quitan suscriptores en tiempo de ejecución.',
      'Base de la programación reactiva y de los sistemas de eventos.',
    ],
    'pt-BR': [
      'Desacopla o emissor de quem reage.',
      'Inscritos podem ser adicionados ou removidos em tempo de execução.',
      'Base da programação reativa e dos sistemas de eventos.',
    ],
  },
  cons: {
    en: [
      'Forgetting to unsubscribe leaks memory.',
      'Notification order is usually not guaranteed.',
      'Notification cascades are hard to debug.',
    ],
    es: [
      'Si te olvidás de desuscribir, aparecen fugas de memoria.',
      'El orden de notificación no suele estar garantizado.',
      'Las cascadas de notificaciones son difíciles de depurar.',
    ],
    'pt-BR': [
      'Esquecer de cancelar a inscrição gera vazamentos de memória.',
      'A ordem das notificações costuma não ser garantida.',
      'Cascatas de notificações são difíceis de depurar.',
    ],
  },
  realWorld: {
    en: "EventTarget and addEventListener, Node's EventEmitter, RxJS observables, the Redux store with subscribe.",
    es: 'EventTarget y addEventListener, EventEmitter de Node, observables de RxJS, el store de Redux con subscribe.',
    'pt-BR':
      'EventTarget e addEventListener, o EventEmitter do Node, os observables do RxJS, o store do Redux com subscribe.',
  },
  example: {
    title: {
      en: 'Temperature sensor with subscribers',
      es: 'Sensor de temperatura con suscriptores',
      'pt-BR': 'Sensor de temperatura com inscritos',
    },
    scenario: {
      en: 'The sump sensor reads the temperature every minute. The heater, the alarm and the phone app need to know, but the sensor should not know any of them.',
      es: 'El sensor del sump lee la temperatura cada minuto. El calentador, la alarma y la app del celular necesitan enterarse, pero el sensor no debería conocer a ninguno.',
      'pt-BR':
        'O sensor do sump lê a temperatura a cada minuto. O aquecedor, o alarme e o app do celular precisam saber, mas o sensor não deveria conhecer nenhum deles.',
    },
    code: `class TemperatureSensor {
  #listeners = new Set();
  #celsius = null;

  subscribe(listener) {
    this.#listeners.add(listener);
    // Return the unsubscribe function: avoids leaks
    return () => this.#listeners.delete(listener);
  }

  read(celsius) {
    this.#celsius = celsius;
    for (const listener of this.#listeners) listener(celsius);
  }
}

const sensor = new TemperatureSensor();

const heater = (c) => console.log(c < 25 ? 'Heater: on' : 'Heater: off');
const alarm = (c) => c > 28 && console.warn('Alarm! High temperature: ' + c + ' °C');
const phone = (c) => console.log('App: ' + c + ' °C');

sensor.subscribe(heater);
sensor.subscribe(alarm);
const stopPhone = sensor.subscribe(phone);

sensor.read(24.6); // all three react
stopPhone(); // the user muted the app
sensor.read(28.4); // only heater and alarm`,
  },
  related: ['pub-sub', 'mediator', 'flux'],
};
