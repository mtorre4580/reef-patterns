import type { Pattern } from '../types';

export const pubSub: Pattern = {
  id: 'pub-sub',
  rank: 18,
  name: 'Pub/Sub',
  nameEs: 'Publicación/suscripción',
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary:
    'Emisores y receptores se comunican a través de un bus de mensajes por tópico, sin conocerse entre sí.',
  when: 'Cuando muchos módulos independientes producen y consumen eventos y querés que se puedan agregar o quitar sin tocar a los demás.',
  pros: [
    'Desacoplamiento total: ni el emisor ni el receptor se conocen.',
    'Escala bien a muchos tópicos y módulos.',
    'Facilita registrar, reproducir o depurar el flujo de eventos.',
  ],
  cons: [
    'El flujo de control se vuelve implícito y difícil de seguir.',
    'Los nombres de tópicos son contratos frágiles sin tipado.',
  ],
  realWorld:
    'BroadcastChannel, mitt y nanoevents, Redis Pub/Sub, Google Cloud Pub/Sub, el bus de eventos de micro-frontends.',
  example: {
    title: 'Bus de eventos del acuario',
    scenario:
      'El simulador de mareas, el controlador de luz y el alimentador publican eventos. La app, el log y las bombas de flujo se suscriben a los que les importan.',
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

// Suscriptores: no saben quién publica
bus.subscribe('tide:change', ({ level }) => console.log('Bombas de flujo al ' + level + '%'));
bus.subscribe('light:sunrise', () => console.log('Log: amanecer en el arrecife'));
const stopFeedPause = bus.subscribe('feed:start', () => console.log('Pausar skimmer 10 min'));

// Publicadores: no saben quién escucha
bus.publish('light:sunrise');
bus.publish('tide:change', { level: 70 });
bus.publish('feed:start');
stopFeedPause();
bus.publish('feed:start'); // nadie escucha`,
  },
  related: ['observer', 'mediator', 'event-sourcing'],
};
