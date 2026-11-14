import type { Pattern } from '../types';

export const bulkhead: Pattern = {
  id: 'bulkhead',
  rank: 50,
  name: 'Bulkhead',
  localName: { en: 'Bulkhead', es: 'Mamparo', 'pt-BR': 'Antepara' },
  category: 'resiliencia',
  tier: 4,
  gof: false,
  summary: {
    en: "Splits resources into isolated compartments so one saturating doesn't sink the others, like the bulkheads of a ship.",
    es: 'Divide los recursos en compartimentos aislados para que la saturación de uno no hunda a los demás, como los mamparos de un barco.',
    'pt-BR':
      'Divide os recursos em compartimentos isolados para que a saturação de um não afunde os outros, como as anteparas de um navio.',
  },
  when: {
    en: 'When several features share a limited resource (connections, threads, request quota) and a slow one can hog it and starve the rest.',
    es: 'Cuando varias funciones comparten un recurso limitado (conexiones, hilos, cuota de requests) y una lenta puede acapararlo y dejar sin servicio al resto.',
    'pt-BR':
      'Quando várias funções compartilham um recurso limitado (conexões, threads, cota de requisições) e uma lenta pode monopolizá-lo e deixar o resto sem serviço.',
  },
  pros: {
    en: [
      'Failures stay contained in their compartment.',
      'Critical features keep reserved capacity.',
    ],
    es: [
      'Las fallas quedan contenidas en su compartimento.',
      'Las funciones críticas conservan capacidad reservada.',
    ],
    'pt-BR': [
      'As falhas ficam contidas no seu compartimento.',
      'As funções críticas mantêm capacidade reservada.',
    ],
  },
  cons: {
    en: [
      'Reserved resources that sit idle.',
      'Choosing the limits of each compartment requires measuring.',
    ],
    es: [
      'Recursos reservados que quedan ociosos.',
      'Elegir los límites de cada compartimento requiere medir.',
    ],
    'pt-BR': [
      'Recursos reservados que ficam ociosos.',
      'Escolher os limites de cada compartimento exige medir.',
    ],
  },
  realWorld: {
    en: "Separate connection pools per service, p-limit per task type, Resilience4j's isolated thread pools, Kubernetes concurrency limits.",
    es: 'Los pools de conexiones separados por servicio, p-limit por tipo de tarea, los thread pools aislados de Resilience4j, los límites de concurrencia de Kubernetes.',
    'pt-BR':
      'Pools de conexões separados por serviço, p-limit por tipo de tarefa, os thread pools isolados do Resilience4j, os limites de concorrência do Kubernetes.',
  },
  example: {
    title: {
      en: 'Alarms that never wait',
      es: 'Alarmas que nunca esperan',
      'pt-BR': 'Alarmes que nunca esperam',
    },
    scenario: {
      en: 'The app does many photo downloads and history reads. Critical alarms get their own compartment: even if photos saturate theirs, an alarm still goes out.',
      es: 'La app hace muchas descargas de fotos y lecturas de historial. Las alarmas críticas tienen su propio compartimento: aunque las fotos saturen el suyo, una alarma sale igual.',
      'pt-BR':
        'O app faz muitos downloads de fotos e leituras de histórico. Os alarmes críticos têm seu próprio compartimento: mesmo que as fotos saturem o delas, um alarme sai igual.',
    },
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
const photos = createBulkhead(2); // compartment for heavy tasks
const alarms = createBulkhead(1); // reserved compartment

for (let i = 0; i < 6; i++) photos.run(() => wait(500));
console.log('Photos queued:', photos.pending); // 4

alarms
  .run(async () => 'Alarm sent: low level in the sump')
  .then(console.log); // goes out immediately, without waiting for the photos`,
  },
  related: ['circuit-breaker', 'retry', 'object-pool'],
};
