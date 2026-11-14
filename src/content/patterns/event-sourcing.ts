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
      en: 'The story of a frag',
      es: 'Historia de un frag',
      'pt-BR': 'A história de um frag',
    },
    scenario: {
      en: 'Everything that happens to a frag is stored as an event: mounted, moved, grew, dosed. The current state comes from replaying the story; you can also see how it looked in March.',
      es: 'Cada cosa que le pasa a un frag queda como evento: se pegó, se movió, creció, se dosificó. El estado actual sale de reproducir la historia; también se puede ver cómo estaba en marzo.',
      'pt-BR':
        'Tudo o que acontece com um frag vira evento: foi colado, foi movido, cresceu, foi dosado. O estado atual sai de reproduzir a história; também dá para ver como estava em março.',
    },
    code: `const events = [
  { type: 'FragMounted', at: '2026-01-10', size: 2, spot: 'rack A1' },
  { type: 'FragMoved', at: '2026-02-02', spot: 'main rock' },
  { type: 'FragGrew', at: '2026-03-15', cm: 1.5 },
  { type: 'FragGrew', at: '2026-05-01', cm: 2 },
];

function apply(state, event) {
  switch (event.type) {
    case 'FragMounted':
      return { size: event.size, spot: event.spot, moves: 0 };
    case 'FragMoved':
      return { ...state, spot: event.spot, moves: state.moves + 1 };
    case 'FragGrew':
      return { ...state, size: state.size + event.cm };
    default:
      return state;
  }
}

const replay = (history, until = '9999') =>
  history.filter((e) => e.at <= until).reduce(apply, null);

console.log(replay(events)); // { size: 5.5, spot: 'main rock', moves: 1 }
console.log(replay(events, '2026-03-31')); // how it looked in March: size 3.5`,
  },
  related: ['cqrs', 'memento', 'command', 'pub-sub'],
};
