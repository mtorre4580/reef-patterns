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
      en: 'Orders and the sales dashboard',
      es: 'Órdenes y el dashboard de ventas',
      'pt-BR': 'Pedidos e o dashboard de vendas',
    },
    scenario: {
      en: 'Orders are written with business rules (no duplicate order numbers). The dashboard shows revenue per day, a very different shape from the orders table. In-memory example.',
      es: 'Las órdenes se escriben con reglas de negocio (sin números de orden repetidos). El dashboard muestra ventas por día, una forma muy distinta a la tabla de órdenes. Ejemplo en memoria.',
      'pt-BR':
        'Os pedidos são gravados com regras de negócio (sem números de pedido repetidos). O dashboard mostra vendas por dia, um formato muito diferente da tabela de pedidos. Exemplo em memória.',
    },
    code: `// Write side: validates and stores facts
const writeModel = { orders: new Map() };

const commands = {
  placeOrder({ number, total, day }) {
    if (writeModel.orders.has(number)) throw new Error('Duplicate order ' + number);
    writeModel.orders.set(number, { number, total, day });
    projector.apply({ total, day }); // updates the read model
  },
};

// Read side: shape ready for the dashboard
const readModel = { revenueByDay: {} };
const projector = {
  apply({ total, day }) {
    readModel.revenueByDay[day] = (readModel.revenueByDay[day] ?? 0) + total;
  },
};

const queries = {
  revenueOn: (day) => readModel.revenueByDay[day] ?? 0,
};

commands.placeOrder({ number: 'A-1', total: 30, day: '2026-03-01' });
commands.placeOrder({ number: 'A-2', total: 45, day: '2026-03-01' });
commands.placeOrder({ number: 'A-3', total: 20, day: '2026-03-02' });
console.log(queries.revenueOn('2026-03-01')); // 75`,
  },
  related: ['event-sourcing', 'flux', 'repository'],
};
