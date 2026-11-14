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
      en: 'Corals suitable for a tank',
      es: 'Corales aptos para un acuario',
      'pt-BR': 'Corais adequados para um aquário',
    },
    scenario: {
      en: 'The frag shop only offers compatible corals: "enough light and compatible flow, and not aggressive if there are close neighbors". The same rules filter the catalog and validate a purchase.',
      es: 'La tienda de frags ofrece solo corales compatibles: “luz suficiente y flujo compatible, y no agresivo si hay vecinos cerca”. Las mismas reglas filtran el catálogo y validan una compra.',
      'pt-BR':
        'A loja de frags só oferece corais compatíveis: "luz suficiente e fluxo compatível, e não agressivo se houver vizinhos perto". As mesmas regras filtram o catálogo e validam uma compra.',
    },
    code: `const spec = (isSatisfiedBy) => ({
  isSatisfiedBy,
  and: (other) => spec((x) => isSatisfiedBy(x) && other.isSatisfiedBy(x)),
  or: (other) => spec((x) => isSatisfiedBy(x) || other.isSatisfiedBy(x)),
  not: () => spec((x) => !isSatisfiedBy(x)),
});

const tank = { par: 220, flow: 'medium', crowded: true };

const enoughLight = spec((coral) => coral.minPar <= tank.par);
const flowFits = spec((coral) => coral.flows.includes(tank.flow));
const aggressive = spec((coral) => coral.sweeperTentacles);

const suitable = enoughLight.and(flowFits).and(tank.crowded ? aggressive.not() : spec(() => true));

const catalog = [
  { name: 'Acropora', minPar: 300, flows: ['high'], sweeperTentacles: false },
  { name: 'Duncan', minPar: 80, flows: ['low', 'medium'], sweeperTentacles: false },
  { name: 'Galaxea', minPar: 150, flows: ['medium'], sweeperTentacles: true },
];

console.log(catalog.filter(suitable.isSatisfiedBy).map((c) => c.name)); // ['Duncan']`,
  },
  related: ['interpreter', 'repository', 'strategy'],
};
