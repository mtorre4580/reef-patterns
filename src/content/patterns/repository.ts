import type { Pattern } from '../types';

export const repository: Pattern = {
  id: 'repository',
  rank: 15,
  name: 'Repository',
  localName: { en: 'Repository', es: 'Repositorio', 'pt-BR': 'Repositório' },
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary: {
    en: 'Exposes a collection of entities with domain operations and hides where and how they are stored.',
    es: 'Expone una colección de entidades con operaciones de dominio y oculta dónde y cómo se guardan.',
    'pt-BR':
      'Expõe uma coleção de entidades com operações de domínio e esconde onde e como elas são guardadas.',
  },
  when: {
    en: "When business logic shouldn't know whether data comes from an API, localStorage, IndexedDB or memory.",
    es: 'Cuando la lógica de negocio no debería saber si los datos vienen de una API, de localStorage, de IndexedDB o de memoria.',
    'pt-BR':
      'Quando a lógica de negócio não deveria saber se os dados vêm de uma API, do localStorage, do IndexedDB ou da memória.',
  },
  pros: {
    en: [
      'Changing storage does not touch the logic.',
      'Fast tests with an in-memory repository.',
      'Queries named after the domain (findByType) instead of infrastructure details.',
    ],
    es: [
      'Cambiar de almacenamiento no toca la lógica.',
      'Tests rápidos con un repositorio en memoria.',
      'Consultas con nombre de dominio (findByType) en vez de detalles de infraestructura.',
    ],
    'pt-BR': [
      'Trocar de armazenamento não mexe na lógica.',
      'Testes rápidos com um repositório em memória.',
      'Consultas com nome de domínio (findByType) em vez de detalhes de infraestrutura.',
    ],
  },
  cons: {
    en: [
      'Another abstraction layer to maintain.',
      'It can hide inefficient queries behind simple methods.',
    ],
    es: [
      'Otra capa de abstracción que mantener.',
      'Puede esconder consultas ineficientes detrás de métodos simples.',
    ],
    'pt-BR': [
      'Outra camada de abstração para manter.',
      'Pode esconder consultas ineficientes atrás de métodos simples.',
    ],
  },
  realWorld: {
    en: 'TypeORM and MikroORM repositories, data layers in apps using TanStack Query, Angular services wrapping HttpClient.',
    es: 'Los repositorios de TypeORM y MikroORM, las capas de datos de apps con TanStack Query, los servicios de Angular que envuelven HttpClient.',
    'pt-BR':
      'Os repositórios do TypeORM e do MikroORM, as camadas de dados de apps com TanStack Query, os serviços do Angular que envolvem o HttpClient.',
  },
  example: {
    title: { en: 'Coral inventory', es: 'Inventario de corales', 'pt-BR': 'Inventário de corais' },
    scenario: {
      en: 'The app keeps the inventory in memory during tests and in a key-value store in production. The frag screen always uses the same API.',
      es: 'La app guarda el inventario en memoria durante los tests y en un almacenamiento clave-valor en producción. La pantalla de frags usa siempre la misma API.',
      'pt-BR':
        'O app guarda o inventário em memória durante os testes e em um armazenamento chave-valor em produção. A tela de frags usa sempre a mesma API.',
    },
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

// Same interface, different storage (storage: any getItem/setItem object)
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
