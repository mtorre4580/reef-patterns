import type { Pattern } from '../types';

export const decorator: Pattern = {
  id: 'decorator',
  rank: 5,
  name: 'Decorator',
  localName: { en: 'Decorator', es: 'Decorador', 'pt-BR': 'Decorador' },
  category: 'estructural',
  tier: 1,
  gof: true,
  summary: {
    en: 'Wraps an object to add behavior without changing its class, keeping the same interface.',
    es: 'Envuelve un objeto para sumarle comportamiento sin modificar su clase, manteniendo la misma interfaz.',
    'pt-BR':
      'Envolve um objeto para somar comportamento sem modificar sua classe, mantendo a mesma interface.',
  },
  when: {
    en: 'When you want to combine optional capabilities (logging, caching, retries, extras) without creating a subclass for every possible combination.',
    es: 'Cuando querés combinar capacidades opcionales (logging, caché, reintentos, extras) sin crear una subclase por cada combinación posible.',
    'pt-BR':
      'Quando você quer combinar capacidades opcionais (logging, cache, novas tentativas, extras) sem criar uma subclasse para cada combinação possível.',
  },
  pros: {
    en: [
      'Capabilities combine freely and in any order.',
      'Follows single responsibility: each wrapper does one thing.',
      'Behavior can be added or removed at runtime.',
    ],
    es: [
      'Las capacidades se combinan libremente y en cualquier orden.',
      'Respeta el principio de responsabilidad única: cada envoltorio hace una cosa.',
      'Se agrega o quita comportamiento en tiempo de ejecución.',
    ],
    'pt-BR': [
      'As capacidades se combinam livremente e em qualquer ordem.',
      'Respeita a responsabilidade única: cada invólucro faz uma coisa.',
      'Comportamento é adicionado ou removido em tempo de execução.',
    ],
  },
  cons: {
    en: [
      'Many thin layers make execution harder to follow.',
      'The wrapping order can change the result.',
    ],
    es: [
      'Muchas capas pequeñas dificultan seguir la ejecución.',
      'El orden de las envolturas puede cambiar el resultado.',
    ],
    'pt-BR': [
      'Muitas camadas pequenas dificultam acompanhar a execução.',
      'A ordem dos invólucros pode mudar o resultado.',
    ],
  },
  realWorld: {
    en: 'Middlewares that wrap fetch, React HOCs, TypeScript/Angular decorators, wrappers such as lodash.memoize.',
    es: 'Middlewares que envuelven fetch, los HOC de React, los decoradores de TypeScript/Angular, wrappers como lodash.memoize.',
    'pt-BR':
      'Middlewares que envolvem o fetch, os HOCs do React, os decorators do TypeScript/Angular, wrappers como lodash.memoize.',
  },
  example: {
    title: {
      en: 'Composable HTTP client',
      es: 'Cliente HTTP componible',
      'pt-BR': 'Cliente HTTP componível',
    },
    scenario: {
      en: 'The base fetcher only performs requests. Some calls need an auth header, others need logging, and some need both, without creating a subclass per combination.',
      es: 'El fetcher base solo hace requests. Algunas llamadas necesitan header de autenticación, otras logging y algunas ambas, sin crear una subclase por combinación.',
      'pt-BR':
        'O fetcher base só faz requisições. Algumas chamadas precisam de header de autenticação, outras de logging e algumas das duas coisas, sem criar uma subclasse por combinação.',
    },
    code: `// Base client: a fake transport that echoes the request
const baseClient = {
  get: (url, headers = {}) => ({ status: 200, url, headers }),
};

// Each decorator receives a client and returns another one with the same interface
const withAuth = (client, token) => ({
  ...client,
  get: (url, headers = {}) => client.get(url, { ...headers, Authorization: 'Bearer ' + token }),
});

const withLogging = (client, log) => ({
  ...client,
  get: (url, headers) => {
    log.push('GET ' + url);
    const response = client.get(url, headers);
    log.push(response.status + ' ' + url);
    return response;
  },
});

const log = [];
const publicClient = withLogging(baseClient, log);
const privateClient = withLogging(withAuth(baseClient, 'abc123'), log);

publicClient.get('/products');
console.log(privateClient.get('/me').headers); // { Authorization: 'Bearer abc123' }
console.log(log);`,
  },
  related: ['proxy', 'hoc', 'middleware', 'adapter'],
};
