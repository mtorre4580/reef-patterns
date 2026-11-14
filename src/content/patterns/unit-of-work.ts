import type { Pattern } from '../types';

export const unitOfWork: Pattern = {
  id: 'unit-of-work',
  rank: 49,
  name: 'Unit of Work',
  localName: { en: 'Unit of Work', es: 'Unidad de trabajo', 'pt-BR': 'Unidade de trabalho' },
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary: {
    en: 'Records every change of a business operation and commits them together at the end, or none at all.',
    es: 'Registra todos los cambios de una operación de negocio y los confirma juntos al final, o ninguno.',
    'pt-BR':
      'Registra todas as mudanças de uma operação de negócio e as confirma juntas no final, ou nenhuma.',
  },
  when: {
    en: 'When an action modifies several entities and you need all of them saved together, in a single write and with no half-done state.',
    es: 'Cuando una acción modifica varias entidades y necesitás que se guarden todas juntas, con una sola escritura y sin estados a medias.',
    'pt-BR':
      'Quando uma ação modifica várias entidades e você precisa que todas sejam salvas juntas, em uma única escrita e sem estados pela metade.',
  },
  pros: {
    en: ['Atomicity: all or nothing.', 'Batches writes and reduces round trips to storage.'],
    es: ['Atomicidad: todo o nada.', 'Agrupa escrituras y reduce viajes al almacenamiento.'],
    'pt-BR': ['Atomicidade: tudo ou nada.', 'Agrupa escritas e reduz idas ao armazenamento.'],
  },
  cons: {
    en: [
      'Tracking what changed adds complexity.',
      'Long units of work hold resources or stale data.',
    ],
    es: [
      'Seguir qué cambió agrega complejidad.',
      'Unidades de trabajo largas retienen recursos o datos viejos.',
    ],
    'pt-BR': [
      'Acompanhar o que mudou adiciona complexidade.',
      'Unidades de trabalho longas retêm recursos ou dados velhos.',
    ],
  },
  realWorld: {
    en: "TypeORM and MikroORM's EntityManager, Entity Framework's DbContext, IndexedDB and Prisma ($transaction) transactions.",
    es: 'El EntityManager de TypeORM y MikroORM, el DbContext de Entity Framework, las transacciones de IndexedDB y de Prisma ($transaction).',
    'pt-BR':
      'O EntityManager do TypeORM e do MikroORM, o DbContext do Entity Framework, as transações do IndexedDB e do Prisma ($transaction).',
  },
  example: {
    title: {
      en: 'Moving corals between tanks',
      es: 'Mover corales entre acuarios',
      'pt-BR': 'Mover corais entre aquários',
    },
    scenario: {
      en: 'Moving a coral from the quarantine tank to the display tank changes two inventories and the history. Either all three are saved, or none.',
      es: 'Pasar un coral del acuario de cuarentena al principal cambia dos inventarios y el historial. O se guardan las tres cosas, o ninguna.',
      'pt-BR':
        'Passar um coral do aquário de quarentena para o principal muda dois inventários e o histórico. Ou se salvam as três coisas, ou nenhuma.',
    },
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
    // Work on a copy: if anything fails, the original stays intact
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
    if (!d.tanks[from].includes(coral)) throw new Error(coral + ' is not in ' + from);
    d.tanks[from] = d.tanks[from].filter((c) => c !== coral);
  });
  uow.register((d) => d.tanks[to].push(coral));
  uow.register((d) => d.history.push(coral + ': ' + from + ' → ' + to));
}

const uow = new UnitOfWork();
moveCoral(uow, 'Zoanthus', 'quarantine', 'display');
uow.commit(db);
console.log(db.tanks, db.writes); // a single write with all three changes`,
  },
  related: ['repository', 'saga', 'command'],
};
