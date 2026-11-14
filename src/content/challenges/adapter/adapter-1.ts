import type { Challenge } from '../../types';

export const adapter1: Challenge = {
  id: 'adapter-1',
  patternId: 'adapter',
  title: 'Unificar test kits',
  difficulty: 'facil',
  story:
    'El colorímetro Hanna reporta alcalinidad en ppm de CaCO₃ y el kit Salifert en meq/L. El historial de alcalinidad solo entiende dKH y explota con cualquier otra forma.',
  instructions:
    'Implementá dos adaptadores que devuelvan `{ dkh, takenAt }` (`takenAt` es un `Date`):\n' +
    '- `fromHanna({ alk_ppm, ts })`: `dkh = +(alk_ppm / 17.86).toFixed(2)`.\n' +
    '- `fromSalifert({ meq, date })`: `dkh = +(meq * 2.8).toFixed(2)`.\n' +
    'No modifiques `AlkalinityLog`.',
  starterCode: `// No modifiques esta clase
class AlkalinityLog {
  #entries = [];
  add(reading) {
    if (typeof reading.dkh !== 'number' || !(reading.takenAt instanceof Date)) {
      throw new TypeError('Lectura inválida');
    }
    this.#entries.push(reading);
  }
  average() {
    const total = this.#entries.reduce((sum, e) => sum + e.dkh, 0);
    return +(total / this.#entries.length).toFixed(2);
  }
}

function fromHanna(reading) {
  return reading;
}

function fromSalifert(reading) {
  return reading;
}
`,
  tests: [
    {
      name: 'adapta una lectura de Hanna',
      code: `const r = fromHanna({ alk_ppm: 143, ts: '2026-03-01T09:00:00Z' });
expect(r.dkh).toBe(8.01);
expect(r.takenAt.toISOString()).toBe('2026-03-01T09:00:00.000Z');`,
    },
    {
      name: 'adapta una lectura de Salifert',
      code: `const r = fromSalifert({ meq: 3, date: '2026-03-02' });
expect(r.dkh).toBe(8.4);
expect(r.takenAt instanceof Date).toBe(true);`,
    },
    {
      name: 'el historial acepta ambas fuentes',
      code: `const log = new AlkalinityLog();
log.add(fromHanna({ alk_ppm: 143, ts: '2026-03-01' }));
log.add(fromSalifert({ meq: 3, date: '2026-03-02' }));
expect(log.average()).toBe(8.21);`,
    },
  ],
  hints: [
    'Cada adaptador es una función que traduce la forma de un dispositivo a la de tu app.',
    '`new Date(reading.ts)` convierte el texto en fecha.',
  ],
  solution: `// No modifiques esta clase
class AlkalinityLog {
  #entries = [];
  add(reading) {
    if (typeof reading.dkh !== 'number' || !(reading.takenAt instanceof Date)) {
      throw new TypeError('Lectura inválida');
    }
    this.#entries.push(reading);
  }
  average() {
    const total = this.#entries.reduce((sum, e) => sum + e.dkh, 0);
    return +(total / this.#entries.length).toFixed(2);
  }
}

function fromHanna({ alk_ppm, ts }) {
  return { dkh: +(alk_ppm / 17.86).toFixed(2), takenAt: new Date(ts) };
}

function fromSalifert({ meq, date }) {
  return { dkh: +(meq * 2.8).toFixed(2), takenAt: new Date(date) };
}
`,
};
