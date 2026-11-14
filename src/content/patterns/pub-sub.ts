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
      en: 'Tank event bus',
      es: 'Bus de eventos del acuario',
      'pt-BR': 'Barramento de eventos do aquário',
    },
    scenario: {
      en: 'The tide simulator, the light controller and the feeder publish events. The app, the log and the flow pumps subscribe to the ones they care about.',
      es: 'El simulador de mareas, el controlador de luz y el alimentador publican eventos. La app, el log y las bombas de flujo se suscriben a los que les importan.',
      'pt-BR':
        'O simulador de marés, o controlador de luz e o alimentador publicam eventos. O app, o log e as bombas de fluxo assinam os que lhes interessam.',
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
bus.subscribe('tide:change', ({ level }) => console.log('Flow pumps at ' + level + '%'));
bus.subscribe('light:sunrise', () => console.log('Log: sunrise on the reef'));
const stopFeedPause = bus.subscribe('feed:start', () => console.log('Pause skimmer for 10 min'));

// Publishers: they do not know who listens
bus.publish('light:sunrise');
bus.publish('tide:change', { level: 70 });
bus.publish('feed:start');
stopFeedPause();
bus.publish('feed:start'); // nobody listens`,
  },
  related: ['observer', 'mediator', 'event-sourcing'],
};
