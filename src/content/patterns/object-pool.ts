import type { Pattern } from '../types';

export const objectPool: Pattern = {
  id: 'object-pool',
  rank: 52,
  name: 'Object Pool',
  nameEs: 'Pool de objetos',
  category: 'creacional',
  tier: 4,
  gof: false,
  summary:
    'Mantiene un conjunto de objetos ya creados para prestarlos y devolverlos, en lugar de crearlos y destruirlos cada vez.',
  when: 'Cuando crear un objeto es caro (conexiones, buffers, workers) o se crean y descartan miles por segundo y el GC genera tirones.',
  pros: [
    'Evita el costo repetido de creación.',
    'Limita la cantidad máxima de recursos en uso.',
    'Menos pausas del recolector en animaciones y juegos.',
  ],
  cons: [
    'Un objeto devuelto con estado sucio contamina al siguiente.',
    'Olvidar devolverlo produce fugas y bloqueos.',
  ],
  realWorld:
    'Los pools de conexiones de pg y mysql2, los pools de workers como Piscina, el reciclado de partículas en Three.js y juegos en canvas.',
  example: {
    title: 'Burbujas del skimmer en el simulador',
    scenario:
      'El simulador anima burbujas que suben y desaparecen. En vez de crear miles por segundo, recicla un pool fijo y las reinicia al reutilizarlas.',
    code: `class BubblePool {
  #free = [];
  created = 0;

  constructor(max) {
    this.max = max;
  }

  acquire(x) {
    let bubble = this.#free.pop();
    if (!bubble) {
      if (this.created >= this.max) return null; // pool agotado
      this.created++;
      bubble = {};
    }
    // Reinicio completo: nunca reutilizar estado sucio
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
  // Las burbujas que llegan a la superficie vuelven al pool
  while (active.length && active[0].y > 100) pool.release(active.shift());
}

console.log('Burbujas creadas en 600 cuadros:', pool.created); // ≤ 50`,
  },
  related: ['flyweight', 'bulkhead', 'singleton'],
};
