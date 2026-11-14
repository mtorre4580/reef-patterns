import type { Pattern } from '../types';

export const cqrs: Pattern = {
  id: 'cqrs',
  rank: 46,
  name: 'CQRS',
  localName: {
    en: 'CQRS',
    es: 'Separación de comandos y consultas',
    'pt-BR': 'Separação de comandos e consultas',
  },
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary: {
    en: 'Separates the model that changes data (commands) from the model that reads it (queries), each optimized for its job.',
    es: 'Separa el modelo que cambia datos (comandos) del modelo que los lee (consultas), cada uno optimizado para su tarea.',
    'pt-BR':
      'Separa o modelo que muda dados (comandos) do modelo que os lê (consultas), cada um otimizado para sua tarefa.',
  },
  when: {
    en: 'When reads and writes have very different shapes and loads: many aggregated views over few writes with complex rules.',
    es: 'Cuando las lecturas y las escrituras tienen formas y cargas muy distintas: muchas vistas agregadas sobre pocas operaciones de escritura con reglas complejas.',
    'pt-BR':
      'Quando leituras e escritas têm formatos e cargas muito diferentes: muitas visões agregadas sobre poucas operações de escrita com regras complexas.',
  },
  pros: {
    en: [
      'Read models optimized for each screen.',
      'Write rules do not mix with presentation.',
      'Reads and writes scale separately.',
    ],
    es: [
      'Modelos de lectura optimizados para cada pantalla.',
      'Las reglas de escritura no se mezclan con la presentación.',
      'Lecturas y escrituras escalan por separado.',
    ],
    'pt-BR': [
      'Modelos de leitura otimizados para cada tela.',
      'As regras de escrita não se misturam com a apresentação.',
      'Leituras e escritas escalam separadamente.',
    ],
  },
  cons: {
    en: [
      'Eventual consistency between both models.',
      'Duplicates models and code; overkill for simple CRUD.',
    ],
    es: [
      'Consistencia eventual entre ambos modelos.',
      'Duplica modelos y código; excesivo en un CRUD simple.',
    ],
    'pt-BR': [
      'Consistência eventual entre os dois modelos.',
      'Duplica modelos e código; exagerado em um CRUD simples.',
    ],
  },
  realWorld: {
    en: 'Event-sourced architectures, NestJS CQRS, read projections in Elasticsearch; in frontend, separating mutations from queries in TanStack Query.',
    es: 'Arquitecturas con event sourcing, NestJS CQRS, las proyecciones de lectura en Elasticsearch; en frontend, separar mutations de queries en TanStack Query.',
    'pt-BR':
      'Arquiteturas com event sourcing, NestJS CQRS, as projeções de leitura no Elasticsearch; no frontend, separar mutations de queries no TanStack Query.',
  },
  example: {
    title: {
      en: 'Dose log and weekly panel',
      es: 'Registro de dosis y panel semanal',
      'pt-BR': 'Registro de doses e painel semanal',
    },
    scenario: {
      en: 'Doses are recorded with validations (a daily limit). The panel shows totals per week and element, a very different shape from the original log. In-memory example.',
      es: 'Las dosis se registran con validaciones (límite diario). El panel muestra totales por semana y elemento, una forma muy distinta a la del registro original. Ejemplo en memoria.',
      'pt-BR':
        'As doses são registradas com validações (limite diário). O painel mostra totais por semana e elemento, um formato muito diferente do registro original. Exemplo em memória.',
    },
    code: `// Write side: validates and stores facts
const writeModel = { doses: [] };

const commands = {
  recordDose({ element, ml, day }) {
    const today = writeModel.doses.filter((d) => d.day === day && d.element === element);
    const total = today.reduce((s, d) => s + d.ml, 0);
    if (total + ml > 60) throw new Error('Exceeds the daily limit for ' + element);
    writeModel.doses.push({ element, ml, day });
    projector.apply({ element, ml, day }); // updates the read model
  },
};

// Read side: shape ready for the panel
const readModel = { weekly: {} };
const projector = {
  apply({ element, ml, day }) {
    const week = 'W' + Math.ceil(day / 7);
    readModel.weekly[week] ??= {};
    readModel.weekly[week][element] = (readModel.weekly[week][element] ?? 0) + ml;
  },
};

const queries = {
  weeklyTotals: (week) => readModel.weekly[week] ?? {},
};

commands.recordDose({ element: 'calcium', ml: 20, day: 1 });
commands.recordDose({ element: 'alk', ml: 20, day: 1 });
commands.recordDose({ element: 'calcium', ml: 25, day: 3 });
console.log(queries.weeklyTotals('W1')); // { calcium: 45, alk: 20 }`,
  },
  related: ['event-sourcing', 'flux', 'repository'],
};
