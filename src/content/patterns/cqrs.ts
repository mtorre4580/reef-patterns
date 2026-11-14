import type { Pattern } from '../types';

export const cqrs: Pattern = {
  id: 'cqrs',
  rank: 46,
  name: 'CQRS',
  nameEs: 'Separación de comandos y consultas',
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary:
    'Separa el modelo que cambia datos (comandos) del modelo que los lee (consultas), cada uno optimizado para su tarea.',
  when: 'Cuando las lecturas y las escrituras tienen formas y cargas muy distintas: muchas vistas agregadas sobre pocas operaciones de escritura con reglas complejas.',
  pros: [
    'Modelos de lectura optimizados para cada pantalla.',
    'Las reglas de escritura no se mezclan con la presentación.',
    'Lecturas y escrituras escalan por separado.',
  ],
  cons: [
    'Consistencia eventual entre ambos modelos.',
    'Duplica modelos y código; excesivo en un CRUD simple.',
  ],
  realWorld:
    'Arquitecturas con event sourcing, NestJS CQRS, las proyecciones de lectura en Elasticsearch; en frontend, separar mutations de queries en TanStack Query.',
  example: {
    title: 'Registro de dosis y panel semanal',
    scenario:
      'Las dosis se registran con validaciones (límite diario). El panel muestra totales por semana y elemento, una forma muy distinta a la del registro original. Ejemplo en memoria.',
    code: `// Lado de escritura: valida y guarda hechos
const writeModel = { doses: [] };

const commands = {
  recordDose({ element, ml, day }) {
    const today = writeModel.doses.filter((d) => d.day === day && d.element === element);
    const total = today.reduce((s, d) => s + d.ml, 0);
    if (total + ml > 60) throw new Error('Supera el límite diario de ' + element);
    writeModel.doses.push({ element, ml, day });
    projector.apply({ element, ml, day }); // actualiza el modelo de lectura
  },
};

// Lado de lectura: forma lista para el panel
const readModel = { weekly: {} };
const projector = {
  apply({ element, ml, day }) {
    const week = 'S' + Math.ceil(day / 7);
    readModel.weekly[week] ??= {};
    readModel.weekly[week][element] = (readModel.weekly[week][element] ?? 0) + ml;
  },
};

const queries = {
  weeklyTotals: (week) => readModel.weekly[week] ?? {},
};

commands.recordDose({ element: 'calcio', ml: 20, day: 1 });
commands.recordDose({ element: 'alk', ml: 20, day: 1 });
commands.recordDose({ element: 'calcio', ml: 25, day: 3 });
console.log(queries.weeklyTotals('S1')); // { calcio: 45, alk: 20 }`,
  },
  related: ['event-sourcing', 'flux', 'repository'],
};
