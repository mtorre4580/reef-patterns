import type { Pattern } from '../types';

export const eventSourcing: Pattern = {
  id: 'event-sourcing',
  rank: 47,
  name: 'Event Sourcing',
  localName: { en: 'Event Sourcing', es: 'Fuente de eventos', 'pt-BR': 'Event sourcing' },
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary: {
    en: 'Stores every change as an immutable event and rebuilds the current state by replaying those events.',
    es: 'Guarda cada cambio como un evento inmutable y reconstruye el estado actual reproduciendo esos eventos.',
    'pt-BR':
      'Guarda cada mudança como um evento imutável e reconstrói o estado atual reproduzindo esses eventos.',
  },
  when: {
    en: 'When you need a full audit trail, to rebuild state at any point in the past or to derive several views from the same history.',
    es: 'Cuando necesitás auditoría completa, reconstruir el estado en cualquier momento del pasado o derivar varias vistas de la misma historia.',
    'pt-BR':
      'Quando você precisa de auditoria completa, reconstruir o estado em qualquer momento do passado ou derivar várias visões da mesma história.',
  },
  pros: {
    en: [
      'Complete, auditable history by design.',
      'State can be rebuilt for any date.',
      'New projections from old events.',
    ],
    es: [
      'Historial completo y auditable por diseño.',
      'Se puede reconstruir el estado de cualquier fecha.',
      'Nuevas proyecciones a partir de eventos viejos.',
    ],
    'pt-BR': [
      'Histórico completo e auditável por design.',
      'Dá para reconstruir o estado de qualquer data.',
      'Novas projeções a partir de eventos antigos.',
    ],
  },
  cons: {
    en: [
      'Versioning events is hard once they are published.',
      'Replaying long histories requires snapshots.',
      'A steep learning curve for the team.',
    ],
    es: [
      'Versionar eventos es difícil una vez publicados.',
      'Reproducir historias largas requiere snapshots.',
      'Curva de aprendizaje alta para el equipo.',
    ],
    'pt-BR': [
      'Versionar eventos é difícil depois de publicados.',
      'Reproduzir históricos longos exige snapshots.',
      'Curva de aprendizado alta para o time.',
    ],
  },
  realWorld: {
    en: "EventStoreDB, Kafka as an event log, accounting ledgers, Git's history; Redux with its action log is similar.",
    es: 'EventStoreDB, Kafka como log de eventos, los ledgers contables, el historial de Git; Redux con su log de acciones se le parece.',
    'pt-BR':
      'EventStoreDB, Kafka como log de eventos, os livros contábeis, o histórico do Git; o Redux com seu log de ações se parece.',
  },
  example: {
    title: {
      en: 'Account balance from events',
      es: 'Saldo de una cuenta a partir de eventos',
      'pt-BR': 'Saldo de uma conta a partir de eventos',
    },
    scenario: {
      en: 'A wallet stores every movement as an event: opened, deposited, withdrew. The balance comes from replaying them, and support can see what the balance was on any date.',
      es: 'Una billetera guarda cada movimiento como evento: abierta, depósito, extracción. El saldo sale de reproducirlos, y soporte puede ver cuál era el saldo en cualquier fecha.',
      'pt-BR':
        'Uma carteira guarda cada movimento como evento: aberta, depósito, saque. O saldo sai de reproduzi-los, e o suporte pode ver qual era o saldo em qualquer data.',
    },
    code: `const events = [
  { type: 'AccountOpened', at: '2026-01-10', owner: 'ana' },
  { type: 'MoneyDeposited', at: '2026-01-12', amount: 500 },
  { type: 'MoneyWithdrawn', at: '2026-02-03', amount: 120 },
  { type: 'MoneyDeposited', at: '2026-03-15', amount: 80 },
];

function apply(state, event) {
  switch (event.type) {
    case 'AccountOpened':
      return { owner: event.owner, balance: 0, movements: 0 };
    case 'MoneyDeposited':
      return { ...state, balance: state.balance + event.amount, movements: state.movements + 1 };
    case 'MoneyWithdrawn':
      return { ...state, balance: state.balance - event.amount, movements: state.movements + 1 };
    default:
      return state;
  }
}

const replay = (history, until = '9999') =>
  history.filter((e) => e.at <= until).reduce(apply, null);

console.log(replay(events)); // { owner: 'ana', balance: 460, movements: 3 }
console.log(replay(events, '2026-02-28')); // balance at the end of February: 380`,
  },
  related: ['cqrs', 'memento', 'command', 'pub-sub'],
};
