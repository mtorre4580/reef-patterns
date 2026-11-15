import type { Pattern } from '../types';

export const singleton: Pattern = {
  id: 'singleton',
  rank: 4,
  name: 'Singleton',
  localName: { en: 'Singleton', es: 'Instancia única', 'pt-BR': 'Instância única' },
  category: 'creacional',
  tier: 1,
  gof: true,
  summary: {
    en: 'Guarantees that only one instance of an object exists and provides a global access point to it.',
    es: 'Garantiza que exista una sola instancia de un objeto y ofrece un punto de acceso global a ella.',
    'pt-BR':
      'Garante que exista uma única instância de um objeto e oferece um ponto de acesso global a ela.',
  },
  when: {
    en: 'When a resource is truly unique in the process (a connection, a configuration, a hardware controller) and creating two copies would break the state.',
    es: 'Cuando un recurso es realmente único en el proceso (una conexión, una configuración, un controlador de hardware) y crear dos copias rompería el estado.',
    'pt-BR':
      'Quando um recurso é realmente único no processo (uma conexão, uma configuração, um controlador de hardware) e criar duas cópias quebraria o estado.',
  },
  pros: {
    en: [
      'Consistent shared state across the app.',
      'Lazy initialization: created the first time it is used.',
    ],
    es: [
      'Estado compartido coherente en toda la app.',
      'Inicialización perezosa: se crea cuando se usa por primera vez.',
    ],
    'pt-BR': [
      'Estado compartilhado coerente em todo o app.',
      'Inicialização preguiçosa: é criado na primeira vez que é usado.',
    ],
  },
  cons: {
    en: [
      'It is global state: it hides dependencies and complicates tests.',
      'Hard to replace with a test double unless combined with injection.',
      'Tempting to abuse for things that are not unique.',
    ],
    es: [
      'Es estado global: oculta dependencias y complica los tests.',
      'Difícil de reemplazar por un doble de prueba si no se combina con inyección.',
      'Tentador de abusar para cosas que no son únicas.',
    ],
    'pt-BR': [
      'É estado global: esconde dependências e complica os testes.',
      'Difícil de substituir por um dublê de teste se não for combinado com injeção.',
      'Tentador de abusar para coisas que não são únicas.',
    ],
  },
  realWorld: {
    en: 'ES modules are singletons by default; the Prisma client, an i18next instance or the TanStack Query queryClient are usually exported this way.',
    es: 'Los módulos ES ya son singletons por defecto; el cliente de Prisma, una instancia de i18next o el queryClient de TanStack Query suelen exportarse así.',
    'pt-BR':
      'Os módulos ES já são singletons por padrão; o cliente do Prisma, uma instância do i18next ou o queryClient do TanStack Query costumam ser exportados assim.',
  },
  example: {
    title: {
      en: 'A single API client',
      es: 'Un único cliente de API',
      'pt-BR': 'Um único cliente de API',
    },
    scenario: {
      en: 'Every module that talks to the backend needs the same base URL and the current auth token. If each one created its own client, logging in would only update some of them.',
      es: 'Todos los módulos que hablan con el backend necesitan la misma URL base y el token de sesión actual. Si cada uno creara su propio cliente, al iniciar sesión solo se actualizarían algunos.',
      'pt-BR':
        'Todos os módulos que falam com o backend precisam da mesma URL base e do token atual. Se cada um criasse seu próprio cliente, ao fazer login só alguns seriam atualizados.',
    },
    code: `class ApiClient {
  static #instance = null;
  #token = null;
  baseUrl = 'https://api.example.com';

  static getInstance() {
    if (!ApiClient.#instance) ApiClient.#instance = new ApiClient();
    return ApiClient.#instance;
  }

  setToken(token) {
    this.#token = token;
  }

  headers() {
    return this.#token ? { Authorization: 'Bearer ' + this.#token } : {};
  }
}

// The login page and the orders page ask for the client…
const fromLogin = ApiClient.getInstance();
const fromOrders = ApiClient.getInstance();

fromLogin.setToken('eyJhbGciOi...');

console.log(fromLogin === fromOrders); // true
console.log(fromOrders.headers()); // the orders page already sees the token`,
  },
  related: ['module', 'dependency-injection', 'provider'],
};
