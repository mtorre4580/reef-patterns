import type { Challenge } from '../../types';

export const singleton1: Challenge = {
  id: 'singleton-1',
  patternId: 'singleton',
  title: {
    en: 'A single API client',
    es: 'Un único cliente de API',
    'pt-BR': 'Um único cliente de API',
  },
  difficulty: 'facil',
  story: {
    en: 'The login page and the orders page each create their own API client. After logging in, the orders page keeps sending requests without the token.',
    es: 'La página de login y la de órdenes crean cada una su propio cliente de API. Después de iniciar sesión, la página de órdenes sigue mandando requests sin el token.',
    'pt-BR':
      'A página de login e a de pedidos criam cada uma seu próprio cliente de API. Depois do login, a página de pedidos continua enviando requisições sem o token.',
  },
  instructions: {
    en: 'Implement `getApiClient()`, which always returns the same `ApiClient` instance.\n- `setToken(token)` stores the auth token.\n- `headers()` returns `{ Authorization: "Bearer <token>" }`, or `{}` when there is no token.\n- The token must persist across calls to `getApiClient()`.',
    es: 'Implementá `getApiClient()`, que siempre devuelve la misma instancia de `ApiClient`.\n- `setToken(token)` guarda el token de sesión.\n- `headers()` devuelve `{ Authorization: "Bearer <token>" }`, o `{}` si no hay token.\n- El token tiene que persistir entre llamadas a `getApiClient()`.',
    'pt-BR':
      'Implemente `getApiClient()`, que sempre devolve a mesma instância de `ApiClient`.\n- `setToken(token)` guarda o token de sessão.\n- `headers()` devolve `{ Authorization: "Bearer <token>" }`, ou `{}` se não houver token.\n- O token precisa persistir entre chamadas a `getApiClient()`.',
  },
  starterCode: `class ApiClient {
  token = null;

  setToken(token) {
    this.token = token;
  }

  headers() {
    return this.token ? { Authorization: 'Bearer ' + this.token } : {};
  }
}

function getApiClient() {
  return new ApiClient();
}
`,
  tests: [
    {
      name: {
        en: 'always returns the same instance',
        es: 'siempre devuelve la misma instancia',
        'pt-BR': 'sempre devolve a mesma instância',
      },
      code: `expect(getApiClient()).toBe(getApiClient());`,
    },
    {
      name: {
        en: 'the token persists across calls',
        es: 'el token persiste entre llamadas',
        'pt-BR': 'o token persiste entre chamadas',
      },
      code: `getApiClient().setToken('abc');
expect(getApiClient().headers()).toEqual({ Authorization: 'Bearer abc' });
getApiClient().setToken(null);`,
    },
    {
      name: {
        en: 'without a token there are no auth headers',
        es: 'sin token no hay headers de autenticación',
        'pt-BR': 'sem token não há headers de autenticação',
      },
      code: `getApiClient().setToken(null);
expect(getApiClient().headers()).toEqual({});`,
    },
  ],
  hints: {
    en: [
      'Keep the instance in a variable outside the function, initially `null`.',
      'In `getApiClient`, only create it if it does not exist yet: `instance ??= new ApiClient()`.',
    ],
    es: [
      'Guardá la instancia en una variable fuera de la función, inicialmente `null`.',
      'En `getApiClient`, creala solo si todavía no existe: `instance ??= new ApiClient()`.',
    ],
    'pt-BR': [
      'Guarde a instância em uma variável fora da função, inicialmente `null`.',
      'Em `getApiClient`, crie-a só se ainda não existir: `instance ??= new ApiClient()`.',
    ],
  },
  solution: `class ApiClient {
  #token = null;

  setToken(token) {
    this.#token = token;
  }

  headers() {
    return this.#token ? { Authorization: 'Bearer ' + this.#token } : {};
  }
}

let instance = null;

function getApiClient() {
  instance ??= new ApiClient();
  return instance;
}
`,
};
