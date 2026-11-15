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
      en: 'Bulk edit in an admin panel',
      es: 'Edición masiva en un panel de admin',
      'pt-BR': 'Edição em massa em um painel de admin',
    },
    scenario: {
      en: 'An admin moves several products to another category and updates their prices. Either every change is saved in one write, or none of them.',
      es: 'Un admin mueve varios productos a otra categoría y actualiza sus precios. O se guardan todos los cambios en una escritura, o ninguno.',
      'pt-BR':
        'Um admin move vários produtos para outra categoria e atualiza seus preços. Ou todas as mudanças são salvas em uma escrita, ou nenhuma.',
    },
    code: `const db = {
  products: { p1: { category: 'shoes', price: 80 }, p2: { category: 'shoes', price: 60 } },
  audit: [],
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
}

function moveToSale(uow, ids, discount) {
  for (const id of ids) {
    uow.register((d) => {
      if (!d.products[id]) throw new Error('Unknown product ' + id);
      d.products[id].category = 'sale';
      d.products[id].price = Math.round(d.products[id].price * (1 - discount));
    });
  }
  uow.register((d) => d.audit.push('moved ' + ids.join(', ') + ' to sale'));
}

const uow = new UnitOfWork();
moveToSale(uow, ['p1', 'p2'], 0.25);
uow.commit(db);
console.log(db.products, db.writes); // a single write with every change`,
  },
  related: ['repository', 'saga', 'command'],
};
