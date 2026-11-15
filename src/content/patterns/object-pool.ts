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
      en: 'Database connection pool',
      es: 'Pool de conexiones a la base de datos',
      'pt-BR': 'Pool de conexões ao banco de dados',
    },
    scenario: {
      en: 'Opening a database connection takes time. The server keeps a fixed pool, lends a connection to each request and gets it back afterwards, resetting it every time.',
      es: 'Abrir una conexión a la base tarda. El servidor mantiene un pool fijo, presta una conexión a cada request y la recupera después, reseteándola cada vez.',
      'pt-BR':
        'Abrir uma conexão com o banco demora. O servidor mantém um pool fixo, empresta uma conexão a cada requisição e a recebe de volta depois, resetando-a toda vez.',
    },
    code: `class ConnectionPool {
  #free = [];
  created = 0;

  constructor(max) {
    this.max = max;
  }

  acquire() {
    let connection = this.#free.pop();
    if (!connection) {
      if (this.created >= this.max) return null; // pool exhausted: the caller must wait
      this.created++;
      connection = { id: this.created }; // in real life: an expensive TCP + TLS handshake
    }
    // Full reset: never reuse dirty state (open transactions, session variables)
    return Object.assign(connection, { inTransaction: false, lastQuery: null });
  }

  release(connection) {
    this.#free.push(connection);
  }
}

const pool = new ConnectionPool(5);

for (let request = 0; request < 1000; request++) {
  const conn = pool.acquire();
  conn.lastQuery = 'SELECT * FROM orders WHERE id = ' + request;
  pool.release(conn); // each request returns its connection when done
}

console.log('Connections created for 1000 requests:', pool.created); // 1`,
  },
  related: ['flyweight', 'bulkhead', 'singleton'],
};
