import type { Pattern } from '../types';

export const bulkhead: Pattern = {
  id: 'bulkhead',
  rank: 50,
  name: 'Bulkhead',
  nameEs: 'Mamparo',
  category: 'resiliencia',
  tier: 4,
  gof: false,
  summary:
    'Divide los recursos en compartimentos aislados para que la saturación de uno no hunda a los demás, como los mamparos de un barco.',
  when: 'Cuando varias funciones comparten un recurso limitado (conexiones, hilos, cuota de requests) y una lenta puede acapararlo y dejar sin servicio al resto.',
  pros: [
    'Las fallas quedan contenidas en su compartimento.',
    'Las funciones críticas conservan capacidad reservada.',
  ],
  cons: [
    'Recursos reservados que quedan ociosos.',
    'Elegir los límites de cada compartimento requiere medir.',
  ],
  realWorld:
    'Los pools de conexiones separados por servicio, p-limit por tipo de tarea, los thread pools aislados de Resilience4j, los límites de concurrencia de Kubernetes.',
  example: {
    title: 'Alarmas que nunca esperan',
    scenario:
      'La app hace muchas descargas de fotos y lecturas de historial. Las alarmas críticas tienen su propio compartimento: aunque las fotos saturen el suyo, una alarma sale igual.',
    code: `function createBulkhead(maxConcurrent) {
  let active = 0;
  const queue = [];

  const next = () => {
    if (active >= maxConcurrent || queue.length === 0) return;
    active++;
    const { task, resolve, reject } = queue.shift();
    task()
      .then(resolve, reject)
      .finally(() => {
        active--;
        next();
      });
  };

  return {
    run: (task) =>
      new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        next();
      }),
    get pending() {
      return queue.length;
    },
  };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const photos = createBulkhead(2); // compartimento para tareas pesadas
const alarms = createBulkhead(1); // compartimento reservado

for (let i = 0; i < 6; i++) photos.run(() => wait(500));
console.log('Fotos en cola:', photos.pending); // 4

alarms
  .run(async () => 'Alarma enviada: nivel bajo en el sump')
  .then(console.log); // sale de inmediato, sin esperar a las fotos`,
  },
  related: ['circuit-breaker', 'retry', 'object-pool'],
};
