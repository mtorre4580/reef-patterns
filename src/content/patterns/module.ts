import type { Pattern } from '../types';

export const modulePattern: Pattern = {
  id: 'module',
  rank: 10,
  name: 'Module',
  nameEs: 'Módulo',
  category: 'estructural',
  tier: 1,
  gof: false,
  summary:
    'Agrupa estado y funciones relacionadas, expone una API pública mínima y oculta el resto.',
  when: 'Siempre que quieras encapsular detalles internos: en JavaScript moderno, cada archivo ES module ya es uno; con closures lo lográs dentro de un archivo.',
  pros: [
    'Estado privado imposible de modificar desde afuera.',
    'API pública pequeña y estable.',
    'Evita contaminar el ámbito global.',
  ],
  cons: [
    'Lo privado no se puede testear directamente.',
    'Con closures, cada instancia duplica sus funciones en memoria.',
  ],
  realWorld:
    'Los ES modules (import/export), el patrón IIFE de la era jQuery, los módulos de Node y los barrels index.ts.',
  example: {
    title: 'Módulo de salinidad',
    scenario:
      'El módulo guarda las últimas lecturas del refractómetro y expone solo el promedio y una alerta. Nadie puede pisar el historial por error.',
    code: `const salinity = (() => {
  // Estado privado: solo existe dentro del closure
  const readings = [];
  const TARGET = 35; // ppt

  function record(ppt) {
    if (ppt < 25 || ppt > 45) throw new RangeError('Lectura imposible: ' + ppt);
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
console.log(salinity.readings); // undefined: el historial es privado`,
  },
  related: ['singleton', 'facade', 'provider'],
};
