import type { Pattern } from '../types';

export const specification: Pattern = {
  id: 'specification',
  rank: 45,
  name: 'Specification',
  nameEs: 'Especificación',
  category: 'comportamiento',
  tier: 4,
  gof: false,
  summary:
    'Encapsula una regla de negocio en un objeto combinable con and, or y not, reutilizable para filtrar y validar.',
  when: 'Cuando las mismas reglas de negocio aparecen en filtros, validaciones y consultas, y se combinan de formas distintas en cada pantalla.',
  pros: ['Reglas con nombre, reutilizables y testeables.', 'Se combinan sin duplicar lógica.'],
  cons: [
    'Mucha ceremonia para reglas triviales.',
    'Traducirlas a consultas de base de datos no es automático.',
  ],
  realWorld:
    'Los criterios de búsqueda en DDD, los filtros combinables de librerías de tablas, las queries de Prisma armadas por composición.',
  example: {
    title: 'Corales aptos para un acuario',
    scenario:
      'La tienda de frags ofrece solo corales compatibles: “luz suficiente y flujo compatible, y no agresivo si hay vecinos cerca”. Las mismas reglas filtran el catálogo y validan una compra.',
    code: `const spec = (isSatisfiedBy) => ({
  isSatisfiedBy,
  and: (other) => spec((x) => isSatisfiedBy(x) && other.isSatisfiedBy(x)),
  or: (other) => spec((x) => isSatisfiedBy(x) || other.isSatisfiedBy(x)),
  not: () => spec((x) => !isSatisfiedBy(x)),
});

const tank = { par: 220, flow: 'medio', crowded: true };

const enoughLight = spec((coral) => coral.minPar <= tank.par);
const flowFits = spec((coral) => coral.flows.includes(tank.flow));
const aggressive = spec((coral) => coral.sweeperTentacles);

const suitable = enoughLight.and(flowFits).and(tank.crowded ? aggressive.not() : spec(() => true));

const catalog = [
  { name: 'Acropora', minPar: 300, flows: ['alto'], sweeperTentacles: false },
  { name: 'Duncan', minPar: 80, flows: ['bajo', 'medio'], sweeperTentacles: false },
  { name: 'Galaxea', minPar: 150, flows: ['medio'], sweeperTentacles: true },
];

console.log(catalog.filter(suitable.isSatisfiedBy).map((c) => c.name)); // ['Duncan']`,
  },
  related: ['interpreter', 'repository', 'strategy'],
};
