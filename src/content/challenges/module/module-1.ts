import type { Challenge } from '../../types';

export const module1: Challenge = {
  id: 'module-1',
  patternId: 'module',
  title: {
    en: 'Private salinity history',
    es: 'Historial de salinidad privado',
    'pt-BR': 'Histórico de salinidade privado',
  },
  difficulty: 'facil',
  story: {
    en: 'The salinity history used to be an object with a public array. An export script emptied it by mistake and the salinity alert stopped working.',
    es: 'El historial de salinidad era un objeto con un array público. Un script de exportación lo vació por error y la alerta de salinidad dejó de funcionar.',
    'pt-BR':
      'O histórico de salinidade era um objeto com um array público. Um script de exportação o esvaziou por engano e o alerta de salinidade parou de funcionar.',
  },
  instructions: {
    en: 'Implement `createSalinityLog()`, which returns a frozen object with only three functions:\n- `record(ppt)`: throws `RangeError` if it is outside 25–45; keeps at most the last 10 readings.\n- `average()`: average rounded to 2 decimals (0 when there are no readings).\n- `isOff()`: `true` if the average is more than 1 ppt away from 35.\nThe readings must not be reachable from outside.',
    es: 'Implementá `createSalinityLog()`, que devuelve un objeto congelado con solo tres funciones:\n- `record(ppt)`: lanza `RangeError` si está fuera de 25–45; guarda como máximo las últimas 10 lecturas.\n- `average()`: promedio redondeado a 2 decimales (0 si no hay lecturas).\n- `isOff()`: `true` si el promedio se aleja más de 1 ppt de 35.\nLas lecturas no deben ser accesibles desde afuera.',
    'pt-BR':
      'Implemente `createSalinityLog()`, que devolve um objeto congelado com apenas três funções:\n- `record(ppt)`: lança `RangeError` se estiver fora de 25–45; guarda no máximo as últimas 10 leituras.\n- `average()`: média arredondada a 2 decimais (0 se não houver leituras).\n- `isOff()`: `true` se a média se afastar mais de 1 ppt de 35.\nAs leituras não devem ser acessíveis de fora.',
  },
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
      name: { en: 'computes the average', es: 'calcula el promedio', 'pt-BR': 'calcula a média' },
      code: `const log = createSalinityLog();
expect(log.average()).toBe(0);
log.record(34.8);
log.record(35.3);
expect(log.average()).toBe(35.05);
expect(log.isOff()).toBe(false);`,
    },
    {
      name: {
        en: 'exposes only the public API',
        es: 'expone solo la API pública',
        'pt-BR': 'expõe só a API pública',
      },
      code: `const log = createSalinityLog();
log.record(35);
expect(Object.keys(log).sort()).toEqual(['average', 'isOff', 'record']);
expect(Object.isFrozen(log)).toBe(true);`,
    },
    {
      name: {
        en: 'rejects impossible readings',
        es: 'rechaza lecturas imposibles',
        'pt-BR': 'rejeita leituras impossíveis',
      },
      code: `expect(() => createSalinityLog().record(60)).toThrow();`,
    },
    {
      name: {
        en: 'keeps only the last 10',
        es: 'guarda solo las últimas 10',
        'pt-BR': 'guarda só as últimas 10',
      },
      code: `const log = createSalinityLog();
log.record(25);
for (let i = 0; i < 10; i++) log.record(37);
expect(log.average()).toBe(37);
expect(log.isOff()).toBe(true);`,
    },
    {
      name: {
        en: 'each history is independent',
        es: 'cada historial es independiente',
        'pt-BR': 'cada histórico é independente',
      },
      code: `const a = createSalinityLog();
const b = createSalinityLog();
a.record(30);
expect(b.average()).toBe(0);`,
    },
  ],
  hints: {
    en: [
      'Declare the array inside the function: the closure keeps it alive and private.',
      'Return `Object.freeze({ record, average, isOff })`.',
      '`readings.shift()` drops the oldest once you go past 10.',
    ],
    es: [
      'Declará el array dentro de la función: el closure lo mantiene vivo y privado.',
      'Devolvé `Object.freeze({ record, average, isOff })`.',
      'Con `readings.shift()` descartás la más vieja cuando pasás de 10.',
    ],
    'pt-BR': [
      'Declare o array dentro da função: o closure o mantém vivo e privado.',
      'Devolva `Object.freeze({ record, average, isOff })`.',
      'Com `readings.shift()` você descarta a mais antiga quando passar de 10.',
    ],
  },
  solution: `function createSalinityLog() {
  const readings = [];

  function record(ppt) {
    if (ppt < 25 || ppt > 45) throw new RangeError('Impossible reading: ' + ppt);
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
