import type { Pattern } from '../types';

export const eventSourcing: Pattern = {
  id: 'event-sourcing',
  rank: 47,
  name: 'Event Sourcing',
  nameEs: 'Fuente de eventos',
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary:
    'Guarda cada cambio como un evento inmutable y reconstruye el estado actual reproduciendo esos eventos.',
  when: 'Cuando necesitás auditoría completa, reconstruir el estado en cualquier momento del pasado o derivar varias vistas de la misma historia.',
  pros: [
    'Historial completo y auditable por diseño.',
    'Se puede reconstruir el estado de cualquier fecha.',
    'Nuevas proyecciones a partir de eventos viejos.',
  ],
  cons: [
    'Versionar eventos es difícil una vez publicados.',
    'Reproducir historias largas requiere snapshots.',
    'Curva de aprendizaje alta para el equipo.',
  ],
  realWorld:
    'EventStoreDB, Kafka como log de eventos, los ledgers contables, el historial de Git; Redux con su log de acciones se le parece.',
  example: {
    title: 'Historia de un frag',
    scenario:
      'Cada cosa que le pasa a un frag queda como evento: se pegó, se movió, creció, se dosificó. El estado actual sale de reproducir la historia; también se puede ver cómo estaba en marzo.',
    code: `const events = [
  { type: 'FragMounted', at: '2026-01-10', size: 2, spot: 'rack A1' },
  { type: 'FragMoved', at: '2026-02-02', spot: 'roca principal' },
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

console.log(replay(events)); // { size: 5.5, spot: 'roca principal', moves: 1 }
console.log(replay(events, '2026-03-31')); // cómo estaba en marzo: size 3.5`,
  },
  related: ['cqrs', 'memento', 'command', 'pub-sub'],
};
