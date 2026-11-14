import type { Pattern } from '../types';

export const unitOfWork: Pattern = {
  id: 'unit-of-work',
  rank: 49,
  name: 'Unit of Work',
  nameEs: 'Unidad de trabajo',
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary:
    'Registra todos los cambios de una operación de negocio y los confirma juntos al final, o ninguno.',
  when: 'Cuando una acción modifica varias entidades y necesitás que se guarden todas juntas, con una sola escritura y sin estados a medias.',
  pros: ['Atomicidad: todo o nada.', 'Agrupa escrituras y reduce viajes al almacenamiento.'],
  cons: [
    'Seguir qué cambió agrega complejidad.',
    'Unidades de trabajo largas retienen recursos o datos viejos.',
  ],
  realWorld:
    'El EntityManager de TypeORM y MikroORM, el DbContext de Entity Framework, las transacciones de IndexedDB y de Prisma ($transaction).',
  example: {
    title: 'Mover corales entre acuarios',
    scenario:
      'Pasar un coral del acuario de cuarentena al principal cambia dos inventarios y el historial. O se guardan las tres cosas, o ninguna.',
    code: `const db = {
  tanks: { quarantine: ['Zoanthus'], display: ['Acropora'] },
  history: [],
  writes: 0,
};

class UnitOfWork {
  #changes = [];

  register(apply) {
    this.#changes.push(apply);
  }

  commit(store) {
    // Trabajamos sobre una copia: si algo falla, el original queda intacto
    const draft = structuredClone(store);
    for (const apply of this.#changes) apply(draft);
    Object.assign(store, draft, { writes: store.writes + 1 });
    this.#changes = [];
  }

  rollback() {
    this.#changes = [];
  }
}

function moveCoral(uow, coral, from, to) {
  uow.register((d) => {
    if (!d.tanks[from].includes(coral)) throw new Error(coral + ' no está en ' + from);
    d.tanks[from] = d.tanks[from].filter((c) => c !== coral);
  });
  uow.register((d) => d.tanks[to].push(coral));
  uow.register((d) => d.history.push(coral + ': ' + from + ' → ' + to));
}

const uow = new UnitOfWork();
moveCoral(uow, 'Zoanthus', 'quarantine', 'display');
uow.commit(db);
console.log(db.tanks, db.writes); // una sola escritura con los tres cambios`,
  },
  related: ['repository', 'saga', 'command'],
};
