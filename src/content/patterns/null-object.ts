import type { Pattern } from '../types';

export const nullObject: Pattern = {
  id: 'null-object',
  rank: 34,
  name: 'Null Object',
  nameEs: 'Objeto nulo',
  category: 'comportamiento',
  tier: 3,
  gof: false,
  summary:
    'Reemplaza null por un objeto con la misma interfaz que no hace nada, para eliminar chequeos repetidos.',
  when: 'Cuando el código se llena de “if (x) x.algo()” porque una dependencia es opcional, y no hacer nada es un comportamiento válido.',
  pros: ['Elimina chequeos de null repetidos.', 'El flujo del código queda lineal.'],
  cons: [
    'Puede ocultar errores reales: algo falta y nadie se entera.',
    'Hay que mantenerlo sincronizado con la interfaz real.',
  ],
  realWorld:
    'Loggers silenciosos (noop logger), AbortSignal que nunca se aborta, el operador ?. como alternativa moderna, los controladores dummy en tests.',
  example: {
    title: 'Notificador opcional',
    scenario:
      'No todos los acuarios tienen la app del celular configurada. En lugar de preguntar en cada alarma si existe un notificador, se usa uno que no hace nada.',
    code: `class PushNotifier {
  constructor(token) {
    this.token = token;
    this.sent = [];
  }
  send(message) {
    this.sent.push(message); // en la vida real, una llamada a la API
  }
}

const silentNotifier = Object.freeze({ send() {} });

function createAlarm(notifier = silentNotifier) {
  return {
    check(param, value, [min, max]) {
      // Sin if (notifier): siempre hay un objeto con send()
      if (value < min || value > max) notifier.send(param + ' fuera de rango: ' + value);
    },
  };
}

const withApp = new PushNotifier('abc123');
createAlarm(withApp).check('pH', 7.6, [7.9, 8.4]);
createAlarm().check('pH', 7.6, [7.9, 8.4]); // no rompe ni notifica
console.log(withApp.sent);`,
  },
  related: ['strategy', 'proxy', 'dependency-injection'],
};
