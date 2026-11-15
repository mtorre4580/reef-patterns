import type { Pattern } from '../types';

export const dependencyInjection: Pattern = {
  id: 'dependency-injection',
  rank: 8,
  name: 'Dependency Injection',
  localName: {
    en: 'Dependency Injection',
    es: 'Inyección de dependencias',
    'pt-BR': 'Injeção de dependências',
  },
  category: 'arquitectura',
  tier: 1,
  gof: false,
  summary: {
    en: 'An object receives its collaborators from the outside instead of creating them itself.',
    es: 'Un objeto recibe sus colaboradores desde afuera en lugar de crearlos él mismo.',
    'pt-BR': 'Um objeto recebe seus colaboradores de fora em vez de criá-los ele mesmo.',
  },
  when: {
    en: 'When a class uses services (network, clock, storage, sensors) that you want to replace in tests or per environment.',
    es: 'Cuando una clase usa servicios (red, reloj, almacenamiento, sensores) que querés reemplazar en tests o según el entorno.',
    'pt-BR':
      'Quando uma classe usa serviços (rede, relógio, armazenamento, sensores) que você quer substituir nos testes ou conforme o ambiente.',
  },
  pros: {
    en: [
      'Simple tests: inject a double instead of the real service.',
      'Dependencies are explicit in the signature.',
      'Changing an implementation does not touch whoever uses it.',
    ],
    es: [
      'Tests simples: se inyecta un doble en lugar del servicio real.',
      'Las dependencias quedan explícitas en la firma.',
      'Cambiar una implementación no obliga a tocar a quien la usa.',
    ],
    'pt-BR': [
      'Testes simples: injeta-se um dublê no lugar do serviço real.',
      'As dependências ficam explícitas na assinatura.',
      'Trocar uma implementação não obriga a mexer em quem a usa.',
    ],
  },
  cons: {
    en: [
      'More parameters and more wiring at the entry point.',
      'With automatic containers, the flow becomes "magic".',
    ],
    es: [
      'Más parámetros y más cableado en el punto de arranque.',
      'Con contenedores automáticos, el flujo se vuelve “mágico”.',
    ],
    'pt-BR': [
      'Mais parâmetros e mais ligações no ponto de inicialização.',
      'Com contêineres automáticos, o fluxo fica "mágico".',
    ],
  },
  realWorld: {
    en: "Angular's provider system, NestJS, React Context as implicit injection, factory parameters in Vitest tests.",
    es: 'El sistema de providers de Angular, NestJS, el Context de React como inyección implícita, los parámetros de fábricas en tests con Vitest.',
    'pt-BR':
      'O sistema de providers do Angular, o NestJS, o Context do React como injeção implícita, os parâmetros de factories nos testes com Vitest.',
  },
  example: {
    title: {
      en: 'A user service with injected dependencies',
      es: 'Servicio de usuarios con dependencias inyectadas',
      'pt-BR': 'Serviço de usuários com dependências injetadas',
    },
    scenario: {
      en: 'The user service fetches profiles from the API and caches them. In production it uses the real HTTP client; in tests it gets a fake one, without a network.',
      es: 'El servicio de usuarios trae perfiles de la API y los cachea. En producción usa el cliente HTTP real; en los tests recibe uno falso, sin red.',
      'pt-BR':
        'O serviço de usuários busca perfis na API e os guarda em cache. Em produção usa o cliente HTTP real; nos testes recebe um falso, sem rede.',
    },
    code: `class UserService {
  // The service does not create its collaborators: they are handed to it
  constructor({ http, cache }) {
    this.http = http;
    this.cache = cache;
  }

  getUser(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    const user = this.http.get('/users/' + id);
    this.cache.set(id, user);
    return user;
  }
}

// Test double: records calls and returns canned data
const calls = [];
const fakeHttp = {
  get: (url) => {
    calls.push(url);
    return { id: url.split('/').at(-1), name: 'Ana' };
  },
};

const service = new UserService({ http: fakeHttp, cache: new Map() });
service.getUser('42');
service.getUser('42');
console.log(calls); // ['/users/42']: the second call came from the cache`,
  },
  related: ['provider', 'strategy', 'hexagonal', 'singleton'],
};
