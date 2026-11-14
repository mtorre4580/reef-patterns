import type { Pattern } from '../types';

export const nullObject: Pattern = {
  id: 'null-object',
  rank: 34,
  name: 'Null Object',
  localName: { en: 'Null Object', es: 'Objeto nulo', 'pt-BR': 'Objeto nulo' },
  category: 'comportamiento',
  tier: 3,
  gof: false,
  summary: {
    en: 'Replaces null with an object that has the same interface and does nothing, removing repeated checks.',
    es: 'Reemplaza null por un objeto con la misma interfaz que no hace nada, para eliminar chequeos repetidos.',
    'pt-BR':
      'Substitui null por um objeto com a mesma interface que não faz nada, para eliminar verificações repetidas.',
  },
  when: {
    en: 'When code fills up with "if (x) x.something()" because a dependency is optional, and doing nothing is valid behavior.',
    es: 'Cuando el código se llena de “if (x) x.algo()” porque una dependencia es opcional, y no hacer nada es un comportamiento válido.',
    'pt-BR':
      'Quando o código se enche de "if (x) x.algo()" porque uma dependência é opcional, e não fazer nada é um comportamento válido.',
  },
  pros: {
    en: ['Removes repeated null checks.', 'Keeps the code flow linear.'],
    es: ['Elimina chequeos de null repetidos.', 'El flujo del código queda lineal.'],
    'pt-BR': ['Elimina verificações de null repetidas.', 'O fluxo do código fica linear.'],
  },
  cons: {
    en: [
      'It can hide real errors: something is missing and nobody notices.',
      'It has to be kept in sync with the real interface.',
    ],
    es: [
      'Puede ocultar errores reales: algo falta y nadie se entera.',
      'Hay que mantenerlo sincronizado con la interfaz real.',
    ],
    'pt-BR': [
      'Pode esconder erros reais: falta algo e ninguém percebe.',
      'É preciso mantê-lo sincronizado com a interface real.',
    ],
  },
  realWorld: {
    en: 'Silent loggers (noop logger), an AbortSignal that never aborts, the ?. operator as a modern alternative, dummy controllers in tests.',
    es: 'Loggers silenciosos (noop logger), AbortSignal que nunca se aborta, el operador ?. como alternativa moderna, los controladores dummy en tests.',
    'pt-BR':
      'Loggers silenciosos (noop logger), um AbortSignal que nunca é abortado, o operador ?. como alternativa moderna, os controladores dummy nos testes.',
  },
  example: {
    title: { en: 'Optional notifier', es: 'Notificador opcional', 'pt-BR': 'Notificador opcional' },
    scenario: {
      en: 'Not every tank has the phone app set up. Instead of asking on every alarm whether a notifier exists, a do-nothing one is used.',
      es: 'No todos los acuarios tienen la app del celular configurada. En lugar de preguntar en cada alarma si existe un notificador, se usa uno que no hace nada.',
      'pt-BR':
        'Nem todo aquário tem o app do celular configurado. Em vez de perguntar a cada alarme se existe um notificador, usa-se um que não faz nada.',
    },
    code: `class PushNotifier {
  constructor(token) {
    this.token = token;
    this.sent = [];
  }
  send(message) {
    this.sent.push(message); // in real life, an API call
  }
}

const silentNotifier = Object.freeze({ send() {} });

function createAlarm(notifier = silentNotifier) {
  return {
    check(param, value, [min, max]) {
      // No if (notifier): there is always an object with send()
      if (value < min || value > max) notifier.send(param + ' out of range: ' + value);
    },
  };
}

const withApp = new PushNotifier('abc123');
createAlarm(withApp).check('pH', 7.6, [7.9, 8.4]);
createAlarm().check('pH', 7.6, [7.9, 8.4]); // does not break and does not notify
console.log(withApp.sent);`,
  },
  related: ['strategy', 'proxy', 'dependency-injection'],
};
