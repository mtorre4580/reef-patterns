import type { Challenge } from '../../types';

export const adapter1: Challenge = {
  id: 'adapter-1',
  patternId: 'adapter',
  title: { en: 'Unify test kits', es: 'Unificar test kits', 'pt-BR': 'Unificar kits de teste' },
  difficulty: 'facil',
  story: {
    en: 'The Hanna colorimeter reports alkalinity in ppm of CaCO₃ and the Salifert kit in meq/L. The alkalinity history only understands dKH and blows up with any other shape.',
    es: 'El colorímetro Hanna reporta alcalinidad en ppm de CaCO₃ y el kit Salifert en meq/L. El historial de alcalinidad solo entiende dKH y explota con cualquier otra forma.',
    'pt-BR':
      'O colorímetro Hanna reporta alcalinidade em ppm de CaCO₃ e o kit Salifert em meq/L. O histórico de alcalinidade só entende dKH e quebra com qualquer outro formato.',
  },
  instructions: {
    en: 'Implement two adapters that return `{ dkh, takenAt }` (`takenAt` is a `Date`):\n- `fromHanna({ alk_ppm, ts })`: `dkh = +(alk_ppm / 17.86).toFixed(2)`.\n- `fromSalifert({ meq, date })`: `dkh = +(meq * 2.8).toFixed(2)`.\nDo not modify `AlkalinityLog`.',
    es: 'Implementá dos adaptadores que devuelvan `{ dkh, takenAt }` (`takenAt` es un `Date`):\n- `fromHanna({ alk_ppm, ts })`: `dkh = +(alk_ppm / 17.86).toFixed(2)`.\n- `fromSalifert({ meq, date })`: `dkh = +(meq * 2.8).toFixed(2)`.\nNo modifiques `AlkalinityLog`.',
    'pt-BR':
      'Implemente dois adaptadores que devolvam `{ dkh, takenAt }` (`takenAt` é um `Date`):\n- `fromHanna({ alk_ppm, ts })`: `dkh = +(alk_ppm / 17.86).toFixed(2)`.\n- `fromSalifert({ meq, date })`: `dkh = +(meq * 2.8).toFixed(2)`.\nNão modifique `AlkalinityLog`.',
  },
  starterCode: `// Do not modify this class
class AlkalinityLog {
  #entries = [];
  add(reading) {
    if (typeof reading.dkh !== 'number' || !(reading.takenAt instanceof Date)) {
      throw new TypeError('Invalid reading');
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
      name: {
        en: 'adapts a Hanna reading',
        es: 'adapta una lectura de Hanna',
        'pt-BR': 'adapta uma leitura do Hanna',
      },
      code: `const r = fromHanna({ alk_ppm: 143, ts: '2026-03-01T09:00:00Z' });
expect(r.dkh).toBe(8.01);
expect(r.takenAt.toISOString()).toBe('2026-03-01T09:00:00.000Z');`,
    },
    {
      name: {
        en: 'adapts a Salifert reading',
        es: 'adapta una lectura de Salifert',
        'pt-BR': 'adapta uma leitura do Salifert',
      },
      code: `const r = fromSalifert({ meq: 3, date: '2026-03-02' });
expect(r.dkh).toBe(8.4);
expect(r.takenAt instanceof Date).toBe(true);`,
    },
    {
      name: {
        en: 'the history accepts both sources',
        es: 'el historial acepta ambas fuentes',
        'pt-BR': 'o histórico aceita as duas fontes',
      },
      code: `const log = new AlkalinityLog();
log.add(fromHanna({ alk_ppm: 143, ts: '2026-03-01' }));
log.add(fromSalifert({ meq: 3, date: '2026-03-02' }));
expect(log.average()).toBe(8.21);`,
    },
  ],
  hints: {
    en: [
      'Each adapter is a function that translates a device shape into the one your app uses.',
      '`new Date(reading.ts)` turns the text into a date.',
    ],
    es: [
      'Cada adaptador es una función que traduce la forma de un dispositivo a la de tu app.',
      '`new Date(reading.ts)` convierte el texto en fecha.',
    ],
    'pt-BR': [
      'Cada adaptador é uma função que traduz o formato de um dispositivo para o do seu app.',
      '`new Date(reading.ts)` converte o texto em data.',
    ],
  },
  solution: `// Do not modify this class
class AlkalinityLog {
  #entries = [];
  add(reading) {
    if (typeof reading.dkh !== 'number' || !(reading.takenAt instanceof Date)) {
      throw new TypeError('Invalid reading');
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
