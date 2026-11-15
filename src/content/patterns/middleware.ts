import type { Pattern } from '../types';

export const middleware: Pattern = {
  id: 'middleware',
  rank: 30,
  name: 'Middleware',
  localName: { en: 'Middleware', es: 'Middleware', 'pt-BR': 'Middleware' },
  category: 'arquitectura',
  tier: 3,
  gof: false,
  summary: {
    en: 'A pipeline of functions that receive a context and decide whether to call the next one, before and after the core action.',
    es: 'Una tubería de funciones que reciben un contexto y deciden si continúan con la siguiente, antes y después de la acción central.',
    'pt-BR':
      'Um pipeline de funções que recebem um contexto e decidem se continuam com a próxima, antes e depois da ação central.',
  },
  when: {
    en: 'When several cross-cutting concerns (logging, auth, validation, metrics) must wrap every operation in a configurable order.',
    es: 'Cuando varias preocupaciones transversales (logging, autenticación, validación, métricas) tienen que envolver cada operación en un orden configurable.',
    'pt-BR':
      'Quando várias preocupações transversais (logging, autenticação, validação, métricas) precisam envolver cada operação em uma ordem configurável.',
  },
  pros: {
    en: [
      'Separate, reusable cross-cutting concerns.',
      'Explicit order that is easy to change.',
      'Each middleware can act before and after the operation.',
    ],
    es: [
      'Preocupaciones transversales separadas y reutilizables.',
      'Orden explícito y fácil de cambiar.',
      'Cada middleware puede actuar antes y después de la operación.',
    ],
    'pt-BR': [
      'Preocupações transversais separadas e reutilizáveis.',
      'Ordem explícita e fácil de mudar.',
      'Cada middleware pode agir antes e depois da operação.',
    ],
  },
  cons: {
    en: [
      'A middleware that does not call next silently cuts the chain.',
      'Shared state in the context becomes a junk drawer.',
    ],
    es: [
      'Un middleware que no llama a next corta toda la cadena en silencio.',
      'El estado compartido en el contexto se vuelve un cajón de sastre.',
    ],
    'pt-BR': [
      'Um middleware que não chama next corta a cadeia em silêncio.',
      'O estado compartilhado no contexto vira uma gaveta de bagunça.',
    ],
  },
  realWorld: {
    en: 'Express and Koa, Redux middlewares, Next.js middleware, Apollo Client links, tRPC plugins.',
    es: 'Express y Koa, los middlewares de Redux, Next.js middleware, los links de Apollo Client, los plugins de tRPC.',
    'pt-BR':
      'Express e Koa, os middlewares do Redux, Next.js middleware, os links do Apollo Client, os plugins do tRPC.',
  },
  example: {
    title: {
      en: 'API request pipeline',
      es: 'Pipeline de requests de una API',
      'pt-BR': 'Pipeline de requisições de uma API',
    },
    scenario: {
      en: 'Every API request is logged, authenticated and rate limited before reaching the handler, in an order that can be changed without touching the handlers.',
      es: 'Cada request de la API se registra, se autentica y se limita por tasa antes de llegar al handler, en un orden que se puede cambiar sin tocar los handlers.',
      'pt-BR':
        'Cada requisição da API é registrada, autenticada e limitada por taxa antes de chegar ao handler, em uma ordem que pode mudar sem mexer nos handlers.',
    },
    code: `function compose(middlewares, handler) {
  return (req) => {
    const dispatch = (i) => {
      const fn = middlewares[i];
      return fn ? fn(req, () => dispatch(i + 1)) : handler(req);
    };
    return dispatch(0);
  };
}

const logger = (req, next) => {
  console.log('→', req.method, req.path);
  const res = next();
  console.log('←', res.status, req.path);
  return res;
};

const auth = (req, next) => (req.headers.authorization ? next() : { status: 401 });

const hits = new Map();
const rateLimit = (req, next) => {
  const count = (hits.get(req.ip) ?? 0) + 1;
  hits.set(req.ip, count);
  return count > 2 ? { status: 429 } : next();
};

const handle = compose([logger, auth, rateLimit], () => ({ status: 200, body: ['order 1'] }));

const req = { method: 'GET', path: '/orders', ip: '10.0.0.1', headers: { authorization: 'Bearer x' } };
handle(req);
handle({ ...req, headers: {} }); // auth cuts the chain: 401
handle(req);
handle(req); // third authenticated hit: 429`,
  },
  related: ['chain-of-responsibility', 'decorator', 'plugin'],
};
