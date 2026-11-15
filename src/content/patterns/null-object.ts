import type { Pattern } from '../types';

export const nullObject: Pattern = {
  id: 'null-object',
  rank: 34,
  name: 'Null Object',
  localName: { en: 'Null Object', es: 'Objeto nulo', 'pt-BR': 'Objeto nulo' },
  category: 'comportamiento',
  tier: 3,
  gof: false,
  summary: {
    en: 'Replaces null with an object that has the same interface and does nothing, removing repeated checks.',
    es: 'Reemplaza null por un objeto con la misma interfaz que no hace nada, para eliminar chequeos repetidos.',
    'pt-BR':
      'Substitui null por um objeto com a mesma interface que não faz nada, para eliminar verificações repetidas.',
  },
  when: {
    en: 'When code fills up with "if (x) x.something()" because a dependency is optional, and doing nothing is valid behavior.',
    es: 'Cuando el código se llena de “if (x) x.algo()” porque una dependencia es opcional, y no hacer nada es un comportamiento válido.',
    'pt-BR':
      'Quando o código se enche de "if (x) x.algo()" porque uma dependência é opcional, e não fazer nada é um comportamento válido.',
  },
  pros: {
    en: ['Removes repeated null checks.', 'Keeps the code flow linear.'],
    es: ['Elimina chequeos de null repetidos.', 'El flujo del código queda lineal.'],
    'pt-BR': ['Elimina verificações de null repetidas.', 'O fluxo do código fica linear.'],
  },
  cons: {
    en: [
      'It can hide real errors: something is missing and nobody notices.',
      'It has to be kept in sync with the real interface.',
    ],
    es: [
      'Puede ocultar errores reales: algo falta y nadie se entera.',
      'Hay que mantenerlo sincronizado con la interfaz real.',
    ],
    'pt-BR': [
      'Pode esconder erros reais: falta algo e ninguém percebe.',
      'É preciso mantê-lo sincronizado com a interface real.',
    ],
  },
  realWorld: {
    en: 'Silent loggers (noop logger), an AbortSignal that never aborts, the ?. operator as a modern alternative, dummy controllers in tests.',
    es: 'Loggers silenciosos (noop logger), AbortSignal que nunca se aborta, el operador ?. como alternativa moderna, los controladores dummy en tests.',
    'pt-BR':
      'Loggers silenciosos (noop logger), um AbortSignal que nunca é abortado, o operador ?. como alternativa moderna, os controladores dummy nos testes.',
  },
  example: {
    title: {
      en: 'Guest user instead of null',
      es: 'Usuario invitado en lugar de null',
      'pt-BR': 'Usuário convidado em vez de null',
    },
    scenario: {
      en: 'Many components check "if (user && user.can(...))". A guest user object with the same interface removes those checks and makes "not logged in" an explicit case.',
      es: 'Muchos componentes chequean "if (user && user.can(...))". Un usuario invitado con la misma interfaz elimina esos chequeos y vuelve explícito el caso "sin sesión".',
      'pt-BR':
        'Muitos componentes verificam "if (user && user.can(...))". Um usuário convidado com a mesma interface elimina essas verificações e torna explícito o caso "sem sessão".',
    },
    code: `class User {
  constructor(name, permissions) {
    this.name = name;
    this.permissions = new Set(permissions);
  }
  can(action) {
    return this.permissions.has(action);
  }
  get isGuest() {
    return false;
  }
}

const guest = Object.freeze({
  name: 'Guest',
  can: () => false,
  isGuest: true,
});

const currentUser = (session) => (session ? new User(session.name, session.permissions) : guest);

function toolbar(user) {
  // No null checks: there is always an object with can() and name
  return [
    'Hi, ' + user.name,
    user.can('orders:refund') ? 'Refund' : null,
    user.isGuest ? 'Sign in' : 'Sign out',
  ].filter(Boolean);
}

console.log(toolbar(currentUser({ name: 'Ana', permissions: ['orders:refund'] })));
console.log(toolbar(currentUser(null)));`,
  },
  related: ['strategy', 'proxy', 'dependency-injection'],
};
