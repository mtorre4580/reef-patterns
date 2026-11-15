import type { Pattern } from '../types';

export const factoryMethod: Pattern = {
  id: 'factory-method',
  rank: 3,
  name: 'Factory Method',
  localName: { en: 'Factory Method', es: 'Método fábrica', 'pt-BR': 'Método fábrica' },
  category: 'creacional',
  tier: 1,
  gof: true,
  summary: {
    en: 'Centralizes object creation in a function or method that decides which concrete class to instantiate.',
    es: 'Centraliza la creación de objetos en una función o método que decide qué clase concreta instanciar.',
    'pt-BR':
      'Centraliza a criação de objetos em uma função ou método que decide qual classe concreta instanciar.',
  },
  when: {
    en: 'When client code knows what it needs ("an email notifier") but should not know how it is built or which concrete class represents it.',
    es: 'Cuando el código cliente sabe qué necesita (“un notificador por email”) pero no debería saber cómo se construye ni qué clase concreta lo representa.',
    'pt-BR':
      'Quando o código cliente sabe do que precisa ("um notificador por email"), mas não deveria saber como ele é construído nem qual classe concreta o representa.',
  },
  pros: {
    en: [
      'A single place to add new types.',
      'The client depends on an interface, not on concrete classes.',
      'Makes it easy to swap implementations in tests.',
    ],
    es: [
      'Un único lugar para agregar tipos nuevos.',
      'El cliente depende de una interfaz, no de clases concretas.',
      'Facilita reemplazar implementaciones en tests.',
    ],
    'pt-BR': [
      'Um único lugar para adicionar tipos novos.',
      'O cliente depende de uma interface, não de classes concretas.',
      'Facilita trocar implementações nos testes.',
    ],
  },
  cons: {
    en: [
      'It can turn into a giant switch unless each type is registered separately.',
      'Adds an indirection that is overkill in simple cases.',
    ],
    es: [
      'Puede convertirse en un switch gigante si no se registra cada tipo por separado.',
      'Agrega una indirección que en casos simples sobra.',
    ],
    'pt-BR': [
      'Pode virar um switch gigante se cada tipo não for registrado separadamente.',
      'Adiciona uma indireção que sobra em casos simples.',
    ],
  },
  realWorld: {
    en: "React.createElement, document.createElement, axios.create, Vue's createApp and Pinia's defineStore factories.",
    es: 'React.createElement, document.createElement, axios.create, los factories de Vue (createApp) y de Pinia (defineStore).',
    'pt-BR':
      'React.createElement, document.createElement, axios.create, as factories do Vue (createApp) e do Pinia (defineStore).',
  },
  example: {
    title: {
      en: 'Notification channel factory',
      es: 'Fábrica de canales de notificación',
      'pt-BR': 'Fábrica de canais de notificação',
    },
    scenario: {
      en: 'Users choose how to be notified: email, SMS or push. The rest of the app asks for "a notifier for this user" and should not care which class it gets.',
      es: 'Los usuarios eligen cómo recibir avisos: email, SMS o push. El resto de la app pide "un notificador para este usuario" y no debería importarle qué clase recibe.',
      'pt-BR':
        'Os usuários escolhem como receber avisos: email, SMS ou push. O resto do app pede "um notificador para este usuário" e não deveria se importar com a classe que recebe.',
    },
    code: `class Notifier {
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
    // SMS has a hard length limit
    return super.send(to, message.slice(0, 160));
  }
}
class PushNotifier extends Notifier {
  channel = 'push';
}

// A registry instead of a switch: adding a channel is one more line
const channels = { email: EmailNotifier, sms: SmsNotifier, push: PushNotifier };

function createNotifier(type) {
  const NotifierClass = channels[type];
  if (!NotifierClass) throw new Error('Unknown channel: ' + type);
  return new NotifierClass();
}

const user = { email: 'ana@example.com', prefers: 'email' };
console.log(createNotifier(user.prefers).send(user.email, 'Your order shipped'));
console.log(createNotifier('sms').send('+5491100000000', 'Your code is 4821'));`,
  },
  related: ['abstract-factory', 'builder', 'prototype'],
};
