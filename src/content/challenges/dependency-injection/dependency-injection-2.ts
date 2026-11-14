import type { Challenge } from '../../types';

export const dependencyInjection2: Challenge = {
  id: 'dependency-injection-2',
  patternId: 'dependency-injection',
  title: {
    en: 'Feeder with an injectable clock',
    es: 'Alimentador con reloj inyectable',
    'pt-BR': 'Alimentador com relógio injetável',
  },
  difficulty: 'media',
  story: {
    en: 'The feeder must dispense food at 10 and 18 h, once per hour. Because it uses `new Date()` internally, the tests only pass when run at those hours.',
    es: 'El alimentador debe largar comida a las 10 y a las 18 h, una sola vez por hora. Como usa `new Date()` adentro, los tests solo pasan si se corren a esas horas.',
    'pt-BR':
      'O alimentador deve soltar comida às 10 e às 18 h, uma única vez por hora. Como usa `new Date()` por dentro, os testes só passam se rodarem nesses horários.',
  },
  instructions: {
    en: 'Implement `FeedingSchedule` with `constructor({ clock, feeder, hours })`:\n- `clock.now()` returns a `Date`; `feeder.dispense(grams)` dispenses food.\n- `tick(grams)`: if the current hour is in `hours` and feeding has not happened yet in that hour of that day, call `feeder.dispense(grams)` and return `true`. Otherwise return `false`.',
    es: 'Implementá `FeedingSchedule` con `constructor({ clock, feeder, hours })`:\n- `clock.now()` devuelve un `Date`; `feeder.dispense(grams)` larga comida.\n- `tick(grams)`: si la hora actual está en `hours` y todavía no se alimentó en esa hora de ese día, llama a `feeder.dispense(grams)` y devuelve `true`. Si no, devuelve `false`.',
    'pt-BR':
      'Implemente `FeedingSchedule` com `constructor({ clock, feeder, hours })`:\n- `clock.now()` devolve um `Date`; `feeder.dispense(grams)` solta comida.\n- `tick(grams)`: se a hora atual estiver em `hours` e ainda não houve alimentação nessa hora daquele dia, chama `feeder.dispense(grams)` e devolve `true`. Caso contrário, devolve `false`.',
  },
  starterCode: `class FeedingSchedule {
  constructor({ hours }) {
    this.hours = hours;
  }

  tick(grams) {
    const hour = new Date().getHours();
    return this.hours.includes(hour);
  }
}
`,
  tests: [
    {
      name: {
        en: 'feeds at the scheduled hour',
        es: 'alimenta a la hora programada',
        'pt-BR': 'alimenta no horário programado',
      },
      code: `const feeder = { dispense: fn() };
const clock = { now: () => new Date(2026, 4, 1, 10, 5) };
const schedule = new FeedingSchedule({ clock, feeder, hours: [10, 18] });
expect(schedule.tick(0.4)).toBe(true);
expect(feeder.dispense.calls).toEqual([[0.4]]);`,
    },
    {
      name: {
        en: 'does not feed outside the schedule',
        es: 'no alimenta fuera de horario',
        'pt-BR': 'não alimenta fora do horário',
      },
      code: `const feeder = { dispense: fn() };
const clock = { now: () => new Date(2026, 4, 1, 13, 0) };
const schedule = new FeedingSchedule({ clock, feeder, hours: [10, 18] });
expect(schedule.tick(0.4)).toBe(false);
expect(feeder.dispense).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'only once per hour and per day',
        es: 'una sola vez por hora y por día',
        'pt-BR': 'uma única vez por hora e por dia',
      },
      code: `let now = new Date(2026, 4, 1, 18, 0);
const feeder = { dispense: fn() };
const schedule = new FeedingSchedule({ clock: { now: () => now }, feeder, hours: [18] });
schedule.tick(1);
now = new Date(2026, 4, 1, 18, 40);
expect(schedule.tick(1)).toBe(false);
now = new Date(2026, 4, 2, 18, 1);
expect(schedule.tick(1)).toBe(true);
expect(feeder.dispense).toHaveBeenCalledTimes(2);`,
    },
  ],
  hints: {
    en: [
      'Store `clock` and `feeder` in the constructor instead of using `new Date()` and hidden effects.',
      'For "once per hour and per day", keep a key like `date-hour` (for example `toDateString() + "-" + hour`) of the last feeding.',
    ],
    es: [
      'Guardá `clock` y `feeder` en el constructor en lugar de usar `new Date()` y efectos ocultos.',
      'Para “una vez por hora y por día”, guardá una clave como `fecha-hora` (por ejemplo `toDateString() + "-" + hora`) de la última alimentación.',
    ],
    'pt-BR': [
      'Guarde `clock` e `feeder` no construtor em vez de usar `new Date()` e efeitos ocultos.',
      'Para "uma vez por hora e por dia", guarde uma chave como `data-hora` (por exemplo `toDateString() + "-" + hour`) da última alimentação.',
    ],
  },
  solution: `class FeedingSchedule {
  #lastFed = null;

  constructor({ clock, feeder, hours }) {
    this.clock = clock;
    this.feeder = feeder;
    this.hours = hours;
  }

  tick(grams) {
    const now = this.clock.now();
    const hour = now.getHours();
    const key = now.toDateString() + '-' + hour;
    if (!this.hours.includes(hour) || this.#lastFed === key) return false;
    this.feeder.dispense(grams);
    this.#lastFed = key;
    return true;
  }
}
`,
};
