import type { Pattern } from '../types';

export const specification: Pattern = {
  id: 'specification',
  rank: 45,
  name: 'Specification',
  localName: { en: 'Specification', es: 'Especificación', 'pt-BR': 'Especificação' },
  category: 'comportamiento',
  tier: 4,
  gof: false,
  summary: {
    en: 'Wraps a business rule in an object that combines with and, or and not, reusable for filtering and validating.',
    es: 'Encapsula una regla de negocio en un objeto combinable con and, or y not, reutilizable para filtrar y validar.',
    'pt-BR':
      'Encapsula uma regra de negócio em um objeto combinável com and, or e not, reutilizável para filtrar e validar.',
  },
  when: {
    en: 'When the same business rules appear in filters, validations and queries, and are combined differently on each screen.',
    es: 'Cuando las mismas reglas de negocio aparecen en filtros, validaciones y consultas, y se combinan de formas distintas en cada pantalla.',
    'pt-BR':
      'Quando as mesmas regras de negócio aparecem em filtros, validações e consultas e se combinam de formas diferentes em cada tela.',
  },
  pros: {
    en: ['Named, reusable and testable rules.', 'They combine without duplicating logic.'],
    es: ['Reglas con nombre, reutilizables y testeables.', 'Se combinan sin duplicar lógica.'],
    'pt-BR': ['Regras com nome, reutilizáveis e testáveis.', 'Combinam-se sem duplicar lógica.'],
  },
  cons: {
    en: [
      'A lot of ceremony for trivial rules.',
      'Translating them into database queries is not automatic.',
    ],
    es: [
      'Mucha ceremonia para reglas triviales.',
      'Traducirlas a consultas de base de datos no es automático.',
    ],
    'pt-BR': [
      'Muita cerimônia para regras triviais.',
      'Traduzi-las para consultas de banco não é automático.',
    ],
  },
  realWorld: {
    en: 'Search criteria in DDD, composable filters in table libraries, Prisma queries built by composition.',
    es: 'Los criterios de búsqueda en DDD, los filtros combinables de librerías de tablas, las queries de Prisma armadas por composición.',
    'pt-BR':
      'Os critérios de busca em DDD, os filtros combináveis de bibliotecas de tabelas, as queries do Prisma montadas por composição.',
  },
  example: {
    title: {
      en: 'Segmenting users for a campaign',
      es: 'Segmentar usuarios para una campaña',
      'pt-BR': 'Segmentar usuários para uma campanha',
    },
    scenario: {
      en: 'Marketing wants to email "active users on a paid plan who have not opened the app in 14 days". The same rules filter the audience and validate a single user before sending.',
      es: 'Marketing quiere mandar un email a "usuarios activos con plan pago que no abren la app hace 14 días". Las mismas reglas filtran la audiencia y validan a un usuario antes de enviar.',
      'pt-BR':
        'O marketing quer mandar um email para "usuários ativos em plano pago que não abrem o app há 14 dias". As mesmas regras filtram a audiência e validam um usuário antes de enviar.',
    },
    code: `const spec = (isSatisfiedBy) => ({
  isSatisfiedBy,
  and: (other) => spec((x) => isSatisfiedBy(x) && other.isSatisfiedBy(x)),
  or: (other) => spec((x) => isSatisfiedBy(x) || other.isSatisfiedBy(x)),
  not: () => spec((x) => !isSatisfiedBy(x)),
});

const today = new Date('2026-03-20');
const daysSince = (date) => (today - new Date(date)) / 86_400_000;

const active = spec((u) => !u.deactivated);
const paid = spec((u) => u.plan !== 'free');
const recentlySeen = spec((u) => daysSince(u.lastSeen) < 14);

const winBackAudience = active.and(paid).and(recentlySeen.not());

const users = [
  { email: 'ana@example.com', plan: 'pro', lastSeen: '2026-02-20' },
  { email: 'leo@example.com', plan: 'free', lastSeen: '2026-01-02' },
  { email: 'mia@example.com', plan: 'team', lastSeen: '2026-03-19' },
];

console.log(users.filter(winBackAudience.isSatisfiedBy).map((u) => u.email)); // ['ana@example.com']`,
  },
  related: ['interpreter', 'repository', 'strategy'],
};
