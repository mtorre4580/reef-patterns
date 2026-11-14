import type { Pattern } from '../types';

export const saga: Pattern = {
  id: 'saga',
  rank: 48,
  name: 'Saga',
  nameEs: 'Saga',
  category: 'resiliencia',
  tier: 4,
  gof: false,
  summary:
    'Coordina una operación de varios pasos sin transacción global, ejecutando compensaciones si algún paso falla.',
  when: 'Cuando un proceso toca varios servicios o recursos que no comparten transacción y, si falla a la mitad, hay que deshacer lo ya hecho.',
  pros: ['Consistencia sin bloqueos distribuidos.', 'Cada paso declara su propia compensación.'],
  cons: [
    'Las compensaciones no siempre devuelven exactamente al estado inicial.',
    'Estados intermedios visibles para otros procesos.',
    'Difícil de testear todas las combinaciones de falla.',
  ],
  realWorld:
    'Temporal, AWS Step Functions, MassTransit; en frontend, redux-saga toma el nombre para orquestar efectos.',
  example: {
    title: 'Reserva de una salida de buceo',
    scenario:
      'Reservar una salida implica lugar en el barco, alquiler de equipo y cobro. Si el cobro falla, se libera el equipo y el lugar en el barco. Simulado en memoria.',
    code: `async function runSaga(steps) {
  const done = [];
  try {
    for (const step of steps) {
      await step.action();
      done.push(step);
    }
    return 'confirmada';
  } catch (error) {
    // Compensamos en orden inverso lo que sí se hizo
    for (const step of done.reverse()) await step.compensate();
    return 'cancelada: ' + error.message;
  }
}

const boat = { seats: 1 };
const gear = { tanks: 3 };
const log = [];

const bookDive = runSaga([
  {
    action: async () => (boat.seats--, log.push('lugar reservado')),
    compensate: async () => (boat.seats++, log.push('lugar liberado')),
  },
  {
    action: async () => (gear.tanks--, log.push('tanque alquilado')),
    compensate: async () => (gear.tanks++, log.push('tanque devuelto')),
  },
  {
    action: async () => {
      throw new Error('tarjeta rechazada');
    },
    compensate: async () => {},
  },
]);

bookDive.then((result) => console.log(result, log, boat, gear)); // todo vuelve a su lugar`,
  },
  related: ['unit-of-work', 'command', 'circuit-breaker'],
};
