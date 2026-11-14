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
    title: { en: 'Salinity module', es: 'Módulo de salinidad', 'pt-BR': 'Módulo de salinidade' },
    scenario: {
      en: 'The module keeps the latest refractometer readings and only exposes the average and an alert. Nobody can overwrite the history by mistake.',
      es: 'El módulo guarda las últimas lecturas del refractómetro y expone solo el promedio y una alerta. Nadie puede pisar el historial por error.',
      'pt-BR':
        'O módulo guarda as últimas leituras do refratômetro e expõe só a média e um alerta. Ninguém consegue sobrescrever o histórico por engano.',
    },
    code: `const salinity = (() => {
  // Private state: it only exists inside the closure
  const readings = [];
  const TARGET = 35; // ppt

  function record(ppt) {
    if (ppt < 25 || ppt > 45) throw new RangeError('Impossible reading: ' + ppt);
    readings.push(ppt);
    if (readings.length > 10) readings.shift();
  }

  function average() {
    return readings.reduce((a, b) => a + b, 0) / (readings.length || 1);
  }

  function isOff() {
    return Math.abs(average() - TARGET) > 1;
  }

  return Object.freeze({ record, average, isOff });
})();

salinity.record(34.8);
salinity.record(35.3);
console.log(salinity.average(), salinity.isOff()); // 35.05 false
console.log(salinity.readings); // undefined: the history is private`,
  },
  related: ['singleton', 'facade', 'provider'],
};
