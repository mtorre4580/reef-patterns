import type { Challenge } from '../../types';

export const module1: Challenge = {
  id: 'module-1',
  patternId: 'module',
  title: 'Historial de salinidad privado',
  difficulty: 'facil',
  story:
    'El historial de salinidad era un objeto con un array público. Un script de exportación lo vació por error y la alerta de salinidad dejó de funcionar.',
  instructions:
    'Implementá `createSalinityLog()`, que devuelve un objeto congelado con solo tres funciones:\n' +
    '- `record(ppt)`: lanza `RangeError` si está fuera de 25–45; guarda como máximo las últimas 10 lecturas.\n' +
    '- `average()`: promedio redondeado a 2 decimales (0 si no hay lecturas).\n' +
    '- `isOff()`: `true` si el promedio se aleja más de 1 ppt de 35.\n' +
    'Las lecturas no deben ser accesibles desde afuera.',
  starterCode: `function createSalinityLog() {
  return {
    readings: [],
    record(ppt) {
      this.readings.push(ppt);
    },
    average() {
      return this.readings.reduce((a, b) => a + b, 0) / this.readings.length;
    },
    isOff() {
      return Math.abs(this.average() - 35) > 1;
    },
  };
}
`,
  tests: [
    {
      name: 'calcula el promedio',
      code: `const log = createSalinityLog();
expect(log.average()).toBe(0);
log.record(34.8);
log.record(35.3);
expect(log.average()).toBe(35.05);
expect(log.isOff()).toBe(false);`,
    },
    {
      name: 'expone solo la API pública',
      code: `const log = createSalinityLog();
log.record(35);
expect(Object.keys(log).sort()).toEqual(['average', 'isOff', 'record']);
expect(Object.isFrozen(log)).toBe(true);`,
    },
    {
      name: 'rechaza lecturas imposibles',
      code: `expect(() => createSalinityLog().record(60)).toThrow();`,
    },
    {
      name: 'guarda solo las últimas 10',
      code: `const log = createSalinityLog();
log.record(25);
for (let i = 0; i < 10; i++) log.record(37);
expect(log.average()).toBe(37);
expect(log.isOff()).toBe(true);`,
    },
    {
      name: 'cada historial es independiente',
      code: `const a = createSalinityLog();
const b = createSalinityLog();
a.record(30);
expect(b.average()).toBe(0);`,
    },
  ],
  hints: [
    'Declará el array dentro de la función: el closure lo mantiene vivo y privado.',
    'Devolvé `Object.freeze({ record, average, isOff })`.',
    'Con `readings.shift()` descartás la más vieja cuando pasás de 10.',
  ],
  solution: `function createSalinityLog() {
  const readings = [];

  function record(ppt) {
    if (ppt < 25 || ppt > 45) throw new RangeError('Lectura imposible: ' + ppt);
    readings.push(ppt);
    if (readings.length > 10) readings.shift();
  }

  function average() {
    if (readings.length === 0) return 0;
    return +(readings.reduce((a, b) => a + b, 0) / readings.length).toFixed(2);
  }

  function isOff() {
    return Math.abs(average() - 35) > 1;
  }

  return Object.freeze({ record, average, isOff });
}
`,
};
