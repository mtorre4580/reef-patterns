import type { Pattern } from '../types';

export const pubSub: Pattern = {
  id: 'pub-sub',
  rank: 18,
  name: 'Pub/Sub',
  localName: { en: 'Pub/Sub', es: 'Publicación/suscripción', 'pt-BR': 'Publicação/assinatura' },
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary: {
    en: 'Senders and receivers talk through a topic-based message bus without knowing each other.',
    es: 'Emisores y receptores se comunican a través de un bus de mensajes por tópico, sin conocerse entre sí.',
    'pt-BR':
      'Emissores e receptores se comunicam por meio de um barramento de mensagens por tópico, sem se conhecerem.',
  },
  when: {
    en: 'When many independent modules produce and consume events and you want to add or remove them without touching the others.',
    es: 'Cuando muchos módulos independientes producen y consumen eventos y querés que se puedan agregar o quitar sin tocar a los demás.',
    'pt-BR':
      'Quando muitos módulos independentes produzem e consomem eventos e você quer poder adicioná-los ou removê-los sem mexer nos outros.',
  },
  pros: {
    en: [
      'Full decoupling: neither sender nor receiver knows the other.',
      'Scales well to many topics and modules.',
      'Makes it easy to log, replay or debug the event flow.',
    ],
    es: [
      'Desacoplamiento total: ni el emisor ni el receptor se conocen.',
      'Escala bien a muchos tópicos y módulos.',
      'Facilita registrar, reproducir o depurar el flujo de eventos.',
    ],
    'pt-BR': [
      'Desacoplamento total: nem o emissor nem o receptor se conhecem.',
      'Escala bem para muitos tópicos e módulos.',
      'Facilita registrar, reproduzir ou depurar o fluxo de eventos.',
    ],
  },
  cons: {
    en: [
      'Control flow becomes implicit and hard to follow.',
      'Topic names are fragile, untyped contracts.',
    ],
    es: [
      'El flujo de control se vuelve implícito y difícil de seguir.',
      'Los nombres de tópicos son contratos frágiles sin tipado.',
    ],
    'pt-BR': [
      'O fluxo de controle fica implícito e difícil de seguir.',
      'Os nomes de tópicos são contratos frágeis e sem tipagem.',
    ],
  },
  realWorld: {
    en: 'BroadcastChannel, mitt and nanoevents, Redis Pub/Sub, Google Cloud Pub/Sub, event buses between micro-frontends.',
    es: 'BroadcastChannel, mitt y nanoevents, Redis Pub/Sub, Google Cloud Pub/Sub, el bus de eventos de micro-frontends.',
    'pt-BR':
      'BroadcastChannel, mitt e nanoevents, Redis Pub/Sub, Google Cloud Pub/Sub, o barramento de eventos entre micro-frontends.',
  },
  example: {
    title: {
      en: 'Event bus between micro-frontends',
      es: 'Bus de eventos entre micro-frontends',
      'pt-BR': 'Barramento de eventos entre micro-frontends',
    },
    scenario: {
      en: 'The header, the catalog and the cart are separate micro-frontends. They talk through an event bus by topic, without importing each other.',
      es: 'El header, el catálogo y el carrito son micro-frontends separados. Se comunican con un bus de eventos por tópico, sin importarse entre sí.',
      'pt-BR':
        'O header, o catálogo e o carrinho são micro-frontends separados. Eles conversam por um barramento de eventos por tópico, sem importar uns aos outros.',
    },
    code: `function createBus() {
  const topics = new Map();
  return {
    subscribe(topic, handler) {
      if (!topics.has(topic)) topics.set(topic, new Set());
      topics.get(topic).add(handler);
      return () => topics.get(topic).delete(handler);
    },
    publish(topic, payload) {
      topics.get(topic)?.forEach((handler) => handler(payload));
    },
  };
}

const bus = createBus();

// Subscribers: they do not know who publishes
bus.subscribe('cart:updated', ({ count }) => console.log('Header badge: ' + count));
bus.subscribe('user:logged-in', ({ name }) => console.log('Header greets ' + name));
const stopRecs = bus.subscribe('cart:updated', () => console.log('Refresh recommendations'));

// Publishers: they do not know who listens
bus.publish('user:logged-in', { name: 'Ana' });
bus.publish('cart:updated', { count: 3 });
stopRecs();
bus.publish('cart:updated', { count: 4 }); // only the header reacts`,
  },
  related: ['observer', 'mediator', 'event-sourcing'],
};
