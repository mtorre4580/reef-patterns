import type { Pattern } from '../types';

export const objectPool: Pattern = {
  id: 'object-pool',
  rank: 52,
  name: 'Object Pool',
  localName: { en: 'Object Pool', es: 'Pool de objetos', 'pt-BR': 'Pool de objetos' },
  category: 'creacional',
  tier: 4,
  gof: false,
  summary: {
    en: 'Keeps a set of already-created objects to lend out and take back, instead of creating and destroying them every time.',
    es: 'Mantiene un conjunto de objetos ya creados para prestarlos y devolverlos, en lugar de crearlos y destruirlos cada vez.',
    'pt-BR':
      'Mantém um conjunto de objetos já criados para emprestá-los e recebê-los de volta, em vez de criá-los e destruí-los toda vez.',
  },
  when: {
    en: 'When creating an object is expensive (connections, buffers, workers) or thousands are created and discarded per second and GC causes stutters.',
    es: 'Cuando crear un objeto es caro (conexiones, buffers, workers) o se crean y descartan miles por segundo y el GC genera tirones.',
    'pt-BR':
      'Quando criar um objeto é caro (conexões, buffers, workers) ou milhares são criados e descartados por segundo e o GC causa travadas.',
  },
  pros: {
    en: [
      'Avoids the repeated cost of creation.',
      'Caps the number of resources in use.',
      'Fewer GC pauses in animations and games.',
    ],
    es: [
      'Evita el costo repetido de creación.',
      'Limita la cantidad máxima de recursos en uso.',
      'Menos pausas del recolector en animaciones y juegos.',
    ],
    'pt-BR': [
      'Evita o custo repetido de criação.',
      'Limita a quantidade máxima de recursos em uso.',
      'Menos pausas do coletor em animações e jogos.',
    ],
  },
  cons: {
    en: [
      'A returned object with dirty state contaminates the next user.',
      'Forgetting to return it causes leaks and deadlocks.',
    ],
    es: [
      'Un objeto devuelto con estado sucio contamina al siguiente.',
      'Olvidar devolverlo produce fugas y bloqueos.',
    ],
    'pt-BR': [
      'Um objeto devolvido com estado sujo contamina o próximo.',
      'Esquecer de devolvê-lo produz vazamentos e bloqueios.',
    ],
  },
  realWorld: {
    en: 'pg and mysql2 connection pools, worker pools such as Piscina, particle recycling in Three.js and canvas games.',
    es: 'Los pools de conexiones de pg y mysql2, los pools de workers como Piscina, el reciclado de partículas en Three.js y juegos en canvas.',
    'pt-BR':
      'Os pools de conexões do pg e do mysql2, os pools de workers como o Piscina, a reciclagem de partículas no Three.js e em jogos com canvas.',
  },
  example: {
    title: {
      en: 'Skimmer bubbles in the simulator',
      es: 'Burbujas del skimmer en el simulador',
      'pt-BR': 'Bolhas do skimmer no simulador',
    },
    scenario: {
      en: 'The simulator animates bubbles that rise and pop. Instead of creating thousands per second, it recycles a fixed pool and resets them on reuse.',
      es: 'El simulador anima burbujas que suben y desaparecen. En vez de crear miles por segundo, recicla un pool fijo y las reinicia al reutilizarlas.',
      'pt-BR':
        'O simulador anima bolhas que sobem e somem. Em vez de criar milhares por segundo, recicla um pool fixo e as reinicia ao reutilizá-las.',
    },
    code: `class BubblePool {
  #free = [];
  created = 0;

  constructor(max) {
    this.max = max;
  }

  acquire(x) {
    let bubble = this.#free.pop();
    if (!bubble) {
      if (this.created >= this.max) return null; // pool exhausted
      this.created++;
      bubble = {};
    }
    // Full reset: never reuse dirty state
    return Object.assign(bubble, { x, y: 0, radius: 1 + Math.random() * 2, alive: true });
  }

  release(bubble) {
    bubble.alive = false;
    this.#free.push(bubble);
  }
}

const pool = new BubblePool(50);
const active = [];

for (let frame = 0; frame < 600; frame++) {
  const bubble = pool.acquire(frame % 30);
  if (bubble) active.push(bubble);
  for (const b of active) b.y += 4;
  // Bubbles that reach the surface go back to the pool
  while (active.length && active[0].y > 100) pool.release(active.shift());
}

console.log('Bubbles created in 600 frames:', pool.created); // ≤ 50`,
  },
  related: ['flyweight', 'bulkhead', 'singleton'],
};
