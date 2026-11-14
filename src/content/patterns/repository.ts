import type { Pattern } from '../types';

export const repository: Pattern = {
  id: 'repository',
  rank: 15,
  name: 'Repository',
  nameEs: 'Repositorio',
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary:
    'Expone una colección de entidades con operaciones de dominio y oculta dónde y cómo se guardan.',
  when: 'Cuando la lógica de negocio no debería saber si los datos vienen de una API, de localStorage, de IndexedDB o de memoria.',
  pros: [
    'Cambiar de almacenamiento no toca la lógica.',
    'Tests rápidos con un repositorio en memoria.',
    'Consultas con nombre de dominio (findByType) en vez de detalles de infraestructura.',
  ],
  cons: [
    'Otra capa de abstracción que mantener.',
    'Puede esconder consultas ineficientes detrás de métodos simples.',
  ],
  realWorld:
    'Los repositorios de TypeORM y MikroORM, las capas de datos de apps con TanStack Query, los servicios de Angular que envuelven HttpClient.',
  example: {
    title: 'Inventario de corales',
    scenario:
      'La app guarda el inventario en memoria durante los tests y en un almacenamiento clave-valor en producción. La pantalla de frags usa siempre la misma API.',
    code: `class InMemoryCoralRepository {
  #items = new Map();
  save(coral) {
    this.#items.set(coral.id, { ...coral });
  }
  findById(id) {
    return this.#items.get(id) ?? null;
  }
  findByType(type) {
    return [...this.#items.values()].filter((c) => c.type === type);
  }
}

// Misma interfaz, distinto almacenamiento (storage: cualquier objeto getItem/setItem)
class KeyValueCoralRepository {
  constructor(storage) {
    this.storage = storage;
  }
  #all() {
    return JSON.parse(this.storage.getItem('corals') ?? '[]');
  }
  save(coral) {
    const others = this.#all().filter((c) => c.id !== coral.id);
    this.storage.setItem('corals', JSON.stringify([...others, coral]));
  }
  findById(id) {
    return this.#all().find((c) => c.id === id) ?? null;
  }
  findByType(type) {
    return this.#all().filter((c) => c.type === type);
  }
}

function listSps(repo) {
  return repo.findByType('sps').map((c) => c.name);
}

const repo = new InMemoryCoralRepository();
repo.save({ id: 1, name: 'Montipora digitata', type: 'sps' });
repo.save({ id: 2, name: 'Hammer', type: 'lps' });
console.log(listSps(repo)); // ['Montipora digitata']`,
  },
  related: ['unit-of-work', 'hexagonal', 'dependency-injection', 'specification'],
};
