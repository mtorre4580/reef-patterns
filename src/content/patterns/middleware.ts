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
      en: 'Command pipeline to the controller',
      es: 'Pipeline de comandos al controlador',
      'pt-BR': 'Pipeline de comandos para o controlador',
    },
    scenario: {
      en: 'Every command reaching the tank controller is logged, validated and timed before touching the hardware.',
      es: 'Cada comando que llega al controlador del acuario se registra, se valida y se cronometra antes de tocar el hardware.',
      'pt-BR':
        'Cada comando que chega ao controlador do aquário é registrado, validado e cronometrado antes de tocar no hardware.',
    },
    code: `function compose(middlewares, handler) {
  return (ctx) => {
    const dispatch = (i) => {
      const fn = middlewares[i];
      return fn ? fn(ctx, () => dispatch(i + 1)) : handler(ctx);
    };
    return dispatch(0);
  };
}

const logger = (ctx, next) => {
  console.log('→', ctx.command);
  const result = next();
  console.log('←', ctx.command, result);
  return result;
};

const validate = (ctx, next) => {
  if (ctx.command === 'dose' && ctx.ml > 30) return 'rejected: dose too high';
  return next();
};

const timing = (ctx, next) => {
  const start = Date.now();
  const result = next();
  ctx.ms = Date.now() - start;
  return result;
};

const send = compose([logger, validate, timing], (ctx) => 'ok: ' + ctx.command);

send({ command: 'dose', ml: 10 });
send({ command: 'dose', ml: 80 }); // validate cuts the chain`,
  },
  related: ['chain-of-responsibility', 'decorator', 'plugin'],
};
