import type { Pattern } from '../types';

export const facade: Pattern = {
  id: 'facade',
  rank: 7,
  name: 'Facade',
  localName: { en: 'Facade', es: 'Fachada', 'pt-BR': 'Fachada' },
  category: 'estructural',
  tier: 1,
  gof: true,
  summary: {
    en: 'Provides a simple interface that coordinates a complex subsystem made of several parts.',
    es: 'Ofrece una interfaz simple que coordina un subsistema complejo de varias piezas.',
    'pt-BR': 'Oferece uma interface simples que coordena um subsistema complexo de várias peças.',
  },
  when: {
    en: 'When a common task requires calling several objects in a precise order and you want the rest of the code to do it with a single call.',
    es: 'Cuando una tarea común exige llamar a varios objetos en un orden preciso y querés que el resto del código lo haga con una sola llamada.',
    'pt-BR':
      'Quando uma tarefa comum exige chamar vários objetos em uma ordem precisa e você quer que o resto do código faça isso com uma única chamada.',
  },
  pros: {
    en: [
      'Simplifies using the subsystem and reduces ordering mistakes.',
      'Reduces coupling: the client depends on the facade, not on each part.',
    ],
    es: [
      'Simplifica el uso del subsistema y reduce errores de orden.',
      'Reduce el acoplamiento: el cliente depende de la fachada, no de cada pieza.',
    ],
    'pt-BR': [
      'Simplifica o uso do subsistema e reduz erros de ordem.',
      'Reduz o acoplamento: o cliente depende da fachada, não de cada peça.',
    ],
  },
  cons: {
    en: ['It can grow into a "god object".', 'It hides advanced options that some clients need.'],
    es: [
      'Puede crecer hasta volverse un “objeto dios”.',
      'Oculta opciones avanzadas que algunos clientes necesitan.',
    ],
    'pt-BR': [
      'Pode crescer até virar um "objeto deus".',
      'Esconde opções avançadas de que alguns clientes precisam.',
    ],
  },
  realWorld: {
    en: 'jQuery over the DOM, fetch over XHR and streams, service SDKs (Stripe, Firebase) that hide dozens of endpoints.',
    es: 'jQuery sobre el DOM, fetch sobre XHR y streams, los SDK de servicios (Stripe, Firebase) que esconden decenas de endpoints.',
    'pt-BR':
      'jQuery sobre o DOM, fetch sobre XHR e streams, os SDKs de serviços (Stripe, Firebase) que escondem dezenas de endpoints.',
  },
  example: {
    title: {
      en: 'Placing an order in one call',
      es: 'Crear una orden en una llamada',
      'pt-BR': 'Criar um pedido em uma chamada',
    },
    scenario: {
      en: 'Placing an order means reserving stock, charging the card and sending a confirmation email, in that order. Every screen that buys something should do it with one call.',
      es: 'Crear una orden implica reservar stock, cobrar la tarjeta y mandar el email de confirmación, en ese orden. Cada pantalla que compra algo debería hacerlo con una sola llamada.',
      'pt-BR':
        'Criar um pedido implica reservar estoque, cobrar o cartão e enviar o email de confirmação, nessa ordem. Cada tela que compra algo deveria fazer isso com uma única chamada.',
    },
    code: `const inventory = {
  reserve: (items) => 'res_' + items.length,
  release: (id) => console.log('released ' + id),
};
const payments = { charge: (amount) => 'pay_' + amount };
const mailer = { send: (to, subject) => console.log('mail to ' + to + ': ' + subject) };

class CheckoutFacade {
  constructor({ inventory, payments, mailer }) {
    Object.assign(this, { inventory, payments, mailer });
  }

  placeOrder({ items, total, email }) {
    const reservation = this.inventory.reserve(items);
    try {
      const paymentId = this.payments.charge(total);
      this.mailer.send(email, 'Order confirmed');
      return { reservation, paymentId };
    } catch (error) {
      // If the charge fails, give the stock back
      this.inventory.release(reservation);
      throw error;
    }
  }
}

const checkout = new CheckoutFacade({ inventory, payments, mailer });
console.log(checkout.placeOrder({ items: ['SKU-1', 'SKU-2'], total: 59, email: 'ana@example.com' }));`,
  },
  related: ['adapter', 'mediator', 'module'],
};
