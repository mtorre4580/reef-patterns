import type { Pattern } from '../types';

export const modulePattern: Pattern = {
  id: 'module',
  rank: 10,
  name: 'Module',
  localName: { en: 'Module', es: 'Módulo', 'pt-BR': 'Módulo' },
  category: 'estructural',
  tier: 1,
  gof: false,
  summary: {
    en: 'Groups related state and functions, exposes a minimal public API and hides the rest.',
    es: 'Agrupa estado y funciones relacionadas, expone una API pública mínima y oculta el resto.',
    'pt-BR':
      'Agrupa estado e funções relacionadas, expõe uma API pública mínima e esconde o resto.',
  },
  when: {
    en: 'Whenever you want to encapsulate internal details: in modern JavaScript every ES module file already is one; with closures you get the same inside a file.',
    es: 'Siempre que quieras encapsular detalles internos: en JavaScript moderno, cada archivo ES module ya es uno; con closures lo lográs dentro de un archivo.',
    'pt-BR':
      'Sempre que você quiser encapsular detalhes internos: no JavaScript moderno, cada arquivo de ES module já é um; com closures você consegue o mesmo dentro de um arquivo.',
  },
  pros: {
    en: [
      'Private state that cannot be modified from outside.',
      'A small, stable public API.',
      'Avoids polluting the global scope.',
    ],
    es: [
      'Estado privado imposible de modificar desde afuera.',
      'API pública pequeña y estable.',
      'Evita contaminar el ámbito global.',
    ],
    'pt-BR': [
      'Estado privado impossível de modificar de fora.',
      'API pública pequena e estável.',
      'Evita poluir o escopo global.',
    ],
  },
  cons: {
    en: [
      'Private parts cannot be tested directly.',
      'With closures, each instance duplicates its functions in memory.',
    ],
    es: [
      'Lo privado no se puede testear directamente.',
      'Con closures, cada instancia duplica sus funciones en memoria.',
    ],
    'pt-BR': [
      'O que é privado não pode ser testado diretamente.',
      'Com closures, cada instância duplica suas funções na memória.',
    ],
  },
  realWorld: {
    en: 'ES modules (import/export), the IIFE pattern from the jQuery era, Node modules and index.ts barrels.',
    es: 'Los ES modules (import/export), el patrón IIFE de la era jQuery, los módulos de Node y los barrels index.ts.',
    'pt-BR':
      'Os ES modules (import/export), o padrão IIFE da era jQuery, os módulos do Node e os barrels index.ts.',
  },
  example: {
    title: { en: 'Analytics module', es: 'Módulo de analytics', 'pt-BR': 'Módulo de analytics' },
    scenario: {
      en: 'The analytics module queues events and sends them in batches. Other code can track events and flush, but nobody should be able to edit the queue by mistake.',
      es: 'El módulo de analytics encola eventos y los manda en lotes. El resto del código puede registrar eventos y forzar el envío, pero nadie debería poder tocar la cola por error.',
      'pt-BR':
        'O módulo de analytics enfileira eventos e os envia em lotes. O resto do código pode registrar eventos e forçar o envio, mas ninguém deveria conseguir mexer na fila por engano.',
    },
    code: `const analytics = (() => {
  // Private state: it only exists inside the closure
  const queue = [];
  const BATCH_SIZE = 3;
  let sent = 0;

  function flush() {
    if (queue.length === 0) return 0;
    const batch = queue.splice(0, queue.length);
    sent += batch.length; // in real life: navigator.sendBeacon('/collect', batch)
    return batch.length;
  }

  function track(name, props = {}) {
    queue.push({ name, props, at: Date.now() });
    if (queue.length >= BATCH_SIZE) flush();
  }

  return Object.freeze({ track, flush, stats: () => ({ queued: queue.length, sent }) });
})();

analytics.track('page_view', { path: '/pricing' });
analytics.track('click', { id: 'buy' });
console.log(analytics.stats()); // { queued: 2, sent: 0 }
analytics.track('signup');
console.log(analytics.stats()); // { queued: 0, sent: 3 }
console.log(analytics.queue); // undefined: the queue is private`,
  },
  related: ['singleton', 'facade', 'provider'],
};
