import type { Pattern } from '../types';

export const middleware: Pattern = {
  id: 'middleware',
  rank: 30,
  name: 'Middleware',
  nameEs: 'Middleware',
  category: 'arquitectura',
  tier: 3,
  gof: false,
  summary:
    'Una tubería de funciones que reciben un contexto y deciden si continúan con la siguiente, antes y después de la acción central.',
  when: 'Cuando varias preocupaciones transversales (logging, autenticación, validación, métricas) tienen que envolver cada operación en un orden configurable.',
  pros: [
    'Preocupaciones transversales separadas y reutilizables.',
    'Orden explícito y fácil de cambiar.',
    'Cada middleware puede actuar antes y después de la operación.',
  ],
  cons: [
    'Un middleware que no llama a next corta toda la cadena en silencio.',
    'El estado compartido en el contexto se vuelve un cajón de sastre.',
  ],
  realWorld:
    'Express y Koa, los middlewares de Redux, Next.js middleware, los links de Apollo Client, los plugins de tRPC.',
  example: {
    title: 'Pipeline de comandos al controlador',
    scenario:
      'Cada comando que llega al controlador del acuario se registra, se valida y se cronometra antes de tocar el hardware.',
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
  if (ctx.command === 'dose' && ctx.ml > 30) return 'rechazado: dosis demasiado alta';
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
send({ command: 'dose', ml: 80 }); // validate corta la cadena`,
  },
  related: ['chain-of-responsibility', 'decorator', 'plugin'],
};
