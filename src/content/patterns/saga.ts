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
      en: 'Booking a dive trip',
      es: 'Reserva de una salida de buceo',
      'pt-BR': 'Reserva de uma saída de mergulho',
    },
    scenario: {
      en: 'Booking a trip means a seat on the boat, gear rental and payment. If payment fails, the gear and the boat seat are released. Simulated in memory.',
      es: 'Reservar una salida implica lugar en el barco, alquiler de equipo y cobro. Si el cobro falla, se libera el equipo y el lugar en el barco. Simulado en memoria.',
      'pt-BR':
        'Reservar uma saída implica lugar no barco, aluguel de equipamento e pagamento. Se o pagamento falhar, libera-se o equipamento e o lugar no barco. Simulado em memória.',
    },
    code: `async function runSaga(steps) {
  const done = [];
  try {
    for (const step of steps) {
      await step.action();
      done.push(step);
    }
    return 'confirmed';
  } catch (error) {
    // Compensate, in reverse order, whatever was done
    for (const step of done.reverse()) await step.compensate();
    return 'cancelled: ' + error.message;
  }
}

const boat = { seats: 1 };
const gear = { tanks: 3 };
const log = [];

const bookDive = runSaga([
  {
    action: async () => (boat.seats--, log.push('seat booked')),
    compensate: async () => (boat.seats++, log.push('seat released')),
  },
  {
    action: async () => (gear.tanks--, log.push('tank rented')),
    compensate: async () => (gear.tanks++, log.push('tank returned')),
  },
  {
    action: async () => {
      throw new Error('card declined');
    },
    compensate: async () => {},
  },
]);

bookDive.then((result) => console.log(result, log, boat, gear)); // everything goes back to where it was`,
  },
  related: ['unit-of-work', 'command', 'circuit-breaker'],
};
