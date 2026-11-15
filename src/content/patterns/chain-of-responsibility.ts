import type { Pattern } from '../types';

export const chainOfResponsibility: Pattern = {
  id: 'chain-of-responsibility',
  rank: 19,
  name: 'Chain of Responsibility',
  localName: {
    en: 'Chain of Responsibility',
    es: 'Cadena de responsabilidad',
    'pt-BR': 'Cadeia de responsabilidade',
  },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'Passes a request along a chain of handlers; each one decides whether to handle it, transform it or pass it on.',
    es: 'Pasa una solicitud por una cadena de manejadores; cada uno decide si la atiende, la transforma o la pasa al siguiente.',
    'pt-BR':
      'Passa uma solicitação por uma cadeia de manipuladores; cada um decide se a atende, a transforma ou a passa adiante.',
  },
  when: {
    en: "When several handlers could answer a request based on changing rules and you don't want one giant if that knows them all.",
    es: 'Cuando varios manejadores podrían responder a un pedido según reglas que cambian, y no querés un if gigante que conozca a todos.',
    'pt-BR':
      'Quando vários manipuladores poderiam responder a um pedido segundo regras que mudam, e você não quer um if gigante que conheça todos.',
  },
  pros: {
    en: [
      'Adding, removing or reordering handlers is trivial.',
      'Each handler has a single responsibility.',
    ],
    es: [
      'Agregar, quitar o reordenar manejadores es trivial.',
      'Cada manejador tiene una única responsabilidad.',
    ],
    'pt-BR': [
      'Adicionar, remover ou reordenar manipuladores é trivial.',
      'Cada manipulador tem uma única responsabilidade.',
    ],
  },
  cons: {
    en: [
      'A request can reach the end without anyone handling it.',
      'Debugging long chains means following every link.',
    ],
    es: [
      'Un pedido puede llegar al final sin que nadie lo atienda.',
      'Depurar cadenas largas exige seguir cada eslabón.',
    ],
    'pt-BR': [
      'Um pedido pode chegar ao fim sem que ninguém o atenda.',
      'Depurar cadeias longas exige seguir cada elo.',
    ],
  },
  realWorld: {
    en: 'Express and Koa middlewares, axios interceptors, DOM event propagation, React error boundaries.',
    es: 'Los middlewares de Express y Koa, los interceptores de axios, la propagación de eventos del DOM, los error boundaries de React.',
    'pt-BR':
      'Os middlewares do Express e do Koa, os interceptors do axios, a propagação de eventos do DOM, os error boundaries do React.',
  },
  example: {
    title: {
      en: 'Mapping errors to HTTP responses',
      es: 'Convertir errores en respuestas HTTP',
      'pt-BR': 'Converter erros em respostas HTTP',
    },
    scenario: {
      en: 'The API turns thrown errors into responses: validation errors become 400, missing resources 404, missing sessions 401, and anything else a 500.',
      es: 'La API convierte los errores lanzados en respuestas: los de validación son 400, los recursos inexistentes 404, la falta de sesión 401 y todo lo demás 500.',
      'pt-BR':
        'A API transforma os erros lançados em respostas: os de validação viram 400, recursos inexistentes 404, falta de sessão 401 e todo o resto 500.',
    },
    code: `class ErrorHandler {
  setNext(handler) {
    this.next = handler;
    return handler; // allows chaining: a.setNext(b).setNext(c)
  }
  handle(error) {
    return this.next ? this.next.handle(error) : { status: 500, body: 'Internal error' };
  }
}

class ValidationHandler extends ErrorHandler {
  handle(e) {
    return e.name === 'ValidationError' ? { status: 400, body: e.message } : super.handle(e);
  }
}
class NotFoundHandler extends ErrorHandler {
  handle(e) {
    return e.name === 'NotFoundError' ? { status: 404, body: 'Not found' } : super.handle(e);
  }
}
class AuthHandler extends ErrorHandler {
  handle(e) {
    return e.name === 'AuthError' ? { status: 401, body: 'Please sign in' } : super.handle(e);
  }
}

const chain = new ValidationHandler();
chain.setNext(new NotFoundHandler()).setNext(new AuthHandler());

const error = (name, message = '') => Object.assign(new Error(message), { name });
console.log(chain.handle(error('ValidationError', 'email is required'))); // 400
console.log(chain.handle(error('AuthError'))); // 401
console.log(chain.handle(new TypeError('x is undefined'))); // 500`,
  },
  related: ['middleware', 'command', 'decorator'],
};
