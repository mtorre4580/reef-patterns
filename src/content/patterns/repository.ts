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
    title: {
      en: 'Todo repository',
      es: 'Repositorio de tareas',
      'pt-BR': 'Repositório de tarefas',
    },
    scenario: {
      en: 'The todo app keeps tasks in memory during tests and in localStorage in the browser. The screens always use the same API.',
      es: 'La app de tareas guarda todo en memoria durante los tests y en localStorage en el navegador. Las pantallas usan siempre la misma API.',
      'pt-BR':
        'O app de tarefas guarda tudo em memória durante os testes e no localStorage no navegador. As telas usam sempre a mesma API.',
    },
    code: `class InMemoryTodoRepository {
  #items = new Map();
  save(todo) {
    this.#items.set(todo.id, { ...todo });
  }
  findById(id) {
    return this.#items.get(id) ?? null;
  }
  findPending() {
    return [...this.#items.values()].filter((t) => !t.done);
  }
}

// Same interface, different storage (storage: any getItem/setItem object)
class StorageTodoRepository {
  constructor(storage) {
    this.storage = storage;
  }
  #all() {
    return JSON.parse(this.storage.getItem('todos') ?? '[]');
  }
  save(todo) {
    const others = this.#all().filter((t) => t.id !== todo.id);
    this.storage.setItem('todos', JSON.stringify([...others, todo]));
  }
  findById(id) {
    return this.#all().find((t) => t.id === id) ?? null;
  }
  findPending() {
    return this.#all().filter((t) => !t.done);
  }
}

const pendingTitles = (repo) => repo.findPending().map((t) => t.title);

const repo = new InMemoryTodoRepository();
repo.save({ id: 1, title: 'Write release notes', done: false });
repo.save({ id: 2, title: 'Fix login bug', done: true });
console.log(pendingTitles(repo)); // ['Write release notes']`,
  },
  related: ['unit-of-work', 'hexagonal', 'dependency-injection', 'specification'],
};
