import type { Pattern } from '../types';

export const saga: Pattern = {
  id: 'saga',
  rank: 48,
  name: 'Saga',
  localName: { en: 'Saga', es: 'Saga', 'pt-BR': 'Saga' },
  category: 'resiliencia',
  tier: 4,
  gof: false,
  summary: {
    en: 'Coordinates a multi-step operation without a global transaction, running compensations if any step fails.',
    es: 'Coordina una operación de varios pasos sin transacción global, ejecutando compensaciones si algún paso falla.',
    'pt-BR':
      'Coordena uma operação de vários passos sem transação global, executando compensações se algum passo falhar.',
  },
  when: {
    en: 'When a process touches several services or resources that share no transaction and, if it fails halfway, what was done must be undone.',
    es: 'Cuando un proceso toca varios servicios o recursos que no comparten transacción y, si falla a la mitad, hay que deshacer lo ya hecho.',
    'pt-BR':
      'Quando um processo toca vários serviços ou recursos que não compartilham transação e, se falhar no meio, é preciso desfazer o que já foi feito.',
  },
  pros: {
    en: ['Consistency without distributed locks.', 'Each step declares its own compensation.'],
    es: ['Consistencia sin bloqueos distribuidos.', 'Cada paso declara su propia compensación.'],
    'pt-BR': [
      'Consistência sem bloqueios distribuídos.',
      'Cada passo declara sua própria compensação.',
    ],
  },
  cons: {
    en: [
      'Compensations do not always return exactly to the initial state.',
      'Intermediate states are visible to other processes.',
      'Hard to test every failure combination.',
    ],
    es: [
      'Las compensaciones no siempre devuelven exactamente al estado inicial.',
      'Estados intermedios visibles para otros procesos.',
      'Difícil de testear todas las combinaciones de falla.',
    ],
    'pt-BR': [
      'As compensações nem sempre voltam exatamente ao estado inicial.',
      'Estados intermediários visíveis para outros processos.',
      'Difícil testar todas as combinações de falha.',
    ],
  },
  realWorld: {
    en: 'Temporal, AWS Step Functions, MassTransit; in frontend, redux-saga borrows the name to orchestrate effects.',
    es: 'Temporal, AWS Step Functions, MassTransit; en frontend, redux-saga toma el nombre para orquestar efectos.',
    'pt-BR':
      'Temporal, AWS Step Functions, MassTransit; no frontend, o redux-saga pega o nome para orquestrar efeitos.',
  },
  example: {
    title: {
      en: 'Order saga with compensations',
      es: 'Saga de una orden con compensaciones',
      'pt-BR': 'Saga de um pedido com compensações',
    },
    scenario: {
      en: 'Placing an order reserves stock, charges the card and creates a shipment in three different services. If shipping fails, the charge is refunded and the stock released. Simulated in memory.',
      es: 'Crear una orden reserva stock, cobra la tarjeta y crea un envío en tres servicios distintos. Si el envío falla, se reintegra el cobro y se libera el stock. Simulado en memoria.',
      'pt-BR':
        'Criar um pedido reserva estoque, cobra o cartão e cria um envio em três serviços diferentes. Se o envio falhar, o pagamento é estornado e o estoque liberado. Simulado em memória.',
    },
    code: `async function runSaga(steps) {
  const done = [];
  try {
    for (const step of steps) {
      await step.action();
      done.push(step);
    }
    return 'completed';
  } catch (error) {
    // Compensate, in reverse order, whatever was done
    for (const step of done.reverse()) await step.compensate();
    return 'rolled back: ' + error.message;
  }
}

const stock = { 'SKU-1': 1 };
const log = [];

const placeOrder = runSaga([
  {
    action: async () => (stock['SKU-1']--, log.push('stock reserved')),
    compensate: async () => (stock['SKU-1']++, log.push('stock released')),
  },
  {
    action: async () => log.push('card charged'),
    compensate: async () => log.push('charge refunded'),
  },
  {
    action: async () => {
      throw new Error('carrier API down');
    },
    compensate: async () => {},
  },
]);

placeOrder.then((result) => console.log(result, log, stock)); // everything is undone`,
  },
  related: ['unit-of-work', 'command', 'circuit-breaker'],
};
