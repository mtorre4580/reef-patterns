import type { Challenge } from '../../types';

export const factoryMethod1: Challenge = {
  id: 'factory-method-1',
  patternId: 'factory-method',
  title: {
    en: 'Notification channel factory',
    es: 'Fábrica de canales de notificación',
    'pt-BR': 'Fábrica de canais de notificação',
  },
  difficulty: 'facil',
  story: {
    en: 'Users choose how to be notified. Every screen that sends notifications builds the notifier by hand, and the SMS length limit is only enforced in one of them.',
    es: 'Los usuarios eligen cómo recibir avisos. Cada pantalla que manda notificaciones arma el notificador a mano, y el límite de largo de los SMS solo se respeta en una.',
    'pt-BR':
      'Os usuários escolhem como receber avisos. Cada tela que envia notificações monta o notificador à mão, e o limite de tamanho do SMS só é respeitado em uma delas.',
  },
  instructions: {
    en: 'Implement:\n- Classes `EmailNotifier` (`channel = "email"`), `SmsNotifier` (`"sms"`, which cuts the message to 160 characters) and `PushNotifier` (`"push"`), all with `send(to, message)` returning `"[<channel>] <to>: <message>"`.\n- `createNotifier(type)` for `"email"`, `"sms"` and `"push"`. An unknown type throws `Error("Unknown channel: <type>")`.\n- `registerNotifier(type, NotifierClass)` to add new channels without touching `createNotifier`. No `switch`.',
    es: 'Implementá:\n- Clases `EmailNotifier` (`channel = "email"`), `SmsNotifier` (`"sms"`, que corta el mensaje a 160 caracteres) y `PushNotifier` (`"push"`), todas con `send(to, message)` que devuelve `"[<channel>] <to>: <message>"`.\n- `createNotifier(type)` para `"email"`, `"sms"` y `"push"`. Un tipo desconocido lanza `Error("Unknown channel: <type>")`.\n- `registerNotifier(type, NotifierClass)` para sumar canales sin tocar `createNotifier`. Sin `switch`.',
    'pt-BR':
      'Implemente:\n- As classes `EmailNotifier` (`channel = "email"`), `SmsNotifier` (`"sms"`, que corta a mensagem em 160 caracteres) e `PushNotifier` (`"push"`), todas com `send(to, message)` que devolve `"[<channel>] <to>: <message>"`.\n- `createNotifier(type)` para `"email"`, `"sms"` e `"push"`. Um tipo desconhecido lança `Error("Unknown channel: <type>")`.\n- `registerNotifier(type, NotifierClass)` para adicionar canais sem mexer em `createNotifier`. Sem `switch`.',
  },
  starterCode: `function createNotifier(type) {
  switch (type) {
    case 'email':
      return { channel: 'email', send: (to, msg) => '[email] ' + to + ': ' + msg };
    case 'sms':
      return { channel: 'sms', send: (to, msg) => '[sms] ' + to + ': ' + msg };
    default:
      return { channel: 'push', send: (to, msg) => '[push] ' + to + ': ' + msg };
  }
}
`,
  tests: [
    {
      name: {
        en: 'creates an email notifier',
        es: 'crea un notificador de email',
        'pt-BR': 'cria um notificador de email',
      },
      code: `const notifier = createNotifier('email');
expect(notifier instanceof EmailNotifier).toBe(true);
expect(notifier.send('ana@example.com', 'Hi')).toBe('[email] ana@example.com: Hi');`,
    },
    {
      name: {
        en: 'SMS messages are cut to 160 characters',
        es: 'los SMS se cortan a 160 caracteres',
        'pt-BR': 'os SMS são cortados em 160 caracteres',
      },
      code: `const sent = createNotifier('sms').send('+541100000000', 'x'.repeat(200));
expect(sent.length).toBe('[sms] +541100000000: '.length + 160);
expect(createNotifier('push') instanceof PushNotifier).toBe(true);`,
    },
    {
      name: {
        en: 'an unknown type throws an error',
        es: 'un tipo desconocido lanza un error',
        'pt-BR': 'um tipo desconhecido lança um erro',
      },
      code: `expect(() => createNotifier('fax')).toThrow('Unknown channel: fax');`,
    },
    {
      name: {
        en: 'registerNotifier adds channels without touching the factory',
        es: 'registerNotifier suma canales sin tocar la fábrica',
        'pt-BR': 'registerNotifier adiciona canais sem mexer na fábrica',
      },
      code: `class SlackNotifier {
  channel = 'slack';
  send(to, message) { return 'slack ' + to + ' ' + message; }
}
registerNotifier('slack', SlackNotifier);
const notifier = createNotifier('slack');
expect(notifier instanceof SlackNotifier).toBe(true);
expect(notifier.send('#ops', 'deploy done')).toBe('slack #ops deploy done');`,
    },
  ],
  checks: [
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: {
        en: 'No switch: use a registry',
        es: 'Sin switch: usá un registro',
        'pt-BR': 'Sem switch: use um registro',
      },
    },
  ],
  hints: {
    en: [
      'A base `Notifier` class with `send()` avoids repeating code in the three classes.',
      'Keep the types in a `Map`: `new Map([["email", EmailNotifier], …])`.',
      '`createNotifier` looks up the class and does `new NotifierClass()`; `registerNotifier` only adds an entry.',
    ],
    es: [
      'Una clase base `Notifier` con `send()` evita repetir código en las tres clases.',
      'Guardá los tipos en un `Map`: `new Map([["email", EmailNotifier], …])`.',
      '`createNotifier` busca la clase y hace `new NotifierClass()`; `registerNotifier` solo agrega una entrada.',
    ],
    'pt-BR': [
      'Uma classe base `Notifier` com `send()` evita repetir código nas três classes.',
      'Guarde os tipos em um `Map`: `new Map([["email", EmailNotifier], …])`.',
      '`createNotifier` busca a classe e faz `new NotifierClass()`; `registerNotifier` só adiciona uma entrada.',
    ],
  },
  solution: `class Notifier {
  send(to, message) {
    return '[' + this.channel + '] ' + to + ': ' + message;
  }
}

class EmailNotifier extends Notifier {
  channel = 'email';
}
class SmsNotifier extends Notifier {
  channel = 'sms';
  send(to, message) {
    return super.send(to, message.slice(0, 160));
  }
}
class PushNotifier extends Notifier {
  channel = 'push';
}

const registry = new Map([
  ['email', EmailNotifier],
  ['sms', SmsNotifier],
  ['push', PushNotifier],
]);

function registerNotifier(type, NotifierClass) {
  registry.set(type, NotifierClass);
}

function createNotifier(type) {
  const NotifierClass = registry.get(type);
  if (!NotifierClass) throw new Error('Unknown channel: ' + type);
  return new NotifierClass();
}
`,
};
