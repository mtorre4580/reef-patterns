import type { Challenge } from '../../types';

export const dependencyInjection2: Challenge = {
  id: 'dependency-injection-2',
  patternId: 'dependency-injection',
  title: 'Alimentador con reloj inyectable',
  difficulty: 'media',
  story:
    'El alimentador debe largar comida a las 10 y a las 18 h, una sola vez por hora. Como usa `new Date()` adentro, los tests solo pasan si se corren a esas horas.',
  instructions:
    'Implementá `FeedingSchedule` con `constructor({ clock, feeder, hours })`:\n' +
    '- `clock.now()` devuelve un `Date`; `feeder.dispense(grams)` larga comida.\n' +
    '- `tick(grams)`: si la hora actual está en `hours` y todavía no se alimentó en esa hora de ese día, llama a `feeder.dispense(grams)` y devuelve `true`. Si no, devuelve `false`.',
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
      name: 'alimenta a la hora programada',
      code: `const feeder = { dispense: fn() };
const clock = { now: () => new Date(2026, 4, 1, 10, 5) };
const schedule = new FeedingSchedule({ clock, feeder, hours: [10, 18] });
expect(schedule.tick(0.4)).toBe(true);
expect(feeder.dispense.calls).toEqual([[0.4]]);`,
    },
    {
      name: 'no alimenta fuera de horario',
      code: `const feeder = { dispense: fn() };
const clock = { now: () => new Date(2026, 4, 1, 13, 0) };
const schedule = new FeedingSchedule({ clock, feeder, hours: [10, 18] });
expect(schedule.tick(0.4)).toBe(false);
expect(feeder.dispense).toHaveBeenCalledTimes(0);`,
    },
    {
      name: 'una sola vez por hora y por día',
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
  hints: [
    'Guardá `clock` y `feeder` en el constructor en lugar de usar `new Date()` y efectos ocultos.',
    'Para “una vez por hora y por día”, guardá una clave como `fecha-hora` (por ejemplo `toDateString() + "-" + hora`) de la última alimentación.',
  ],
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
