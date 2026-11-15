import type { Challenge } from '../../types';

export const dependencyInjection2: Challenge = {
  id: 'dependency-injection-2',
  patternId: 'dependency-injection',
  title: {
    en: 'Daily digest with an injectable clock',
    es: 'Resumen diario con reloj inyectable',
    'pt-BR': 'Resumo diário com relógio injetável',
  },
  difficulty: 'media',
  story: {
    en: 'The digest job must email users at 9 and 18 h, once per hour. Because it uses `new Date()` internally, the tests only pass when run at those hours.',
    es: 'El job de resúmenes tiene que mandar emails a las 9 y a las 18 h, una sola vez por hora. Como usa `new Date()` por dentro, los tests solo pasan si se corren a esas horas.',
    'pt-BR':
      'O job de resumos precisa mandar emails às 9 e às 18 h, uma única vez por hora. Como usa `new Date()` por dentro, os testes só passam se rodarem nesses horários.',
  },
  instructions: {
    en: 'Implement `DigestScheduler` with `constructor({ clock, mailer, hours })`:\n- `clock.now()` returns a `Date`; `mailer.send(subject)` sends the digest.\n- `tick(subject)`: if the current hour is in `hours` and nothing was sent yet in that hour of that day, call `mailer.send(subject)` and return `true`. Otherwise return `false`.',
    es: 'Implementá `DigestScheduler` con `constructor({ clock, mailer, hours })`:\n- `clock.now()` devuelve un `Date`; `mailer.send(subject)` manda el resumen.\n- `tick(subject)`: si la hora actual está en `hours` y todavía no se mandó nada en esa hora de ese día, llamá a `mailer.send(subject)` y devolvé `true`. Si no, devolvé `false`.',
    'pt-BR':
      'Implemente `DigestScheduler` com `constructor({ clock, mailer, hours })`:\n- `clock.now()` devolve um `Date`; `mailer.send(subject)` envia o resumo.\n- `tick(subject)`: se a hora atual estiver em `hours` e ainda não foi enviado nada nessa hora daquele dia, chame `mailer.send(subject)` e devolva `true`. Caso contrário, devolva `false`.',
  },
  starterCode: `class DigestScheduler {
  constructor({ hours }) {
    this.hours = hours;
  }

  tick(subject) {
    const hour = new Date().getHours();
    return this.hours.includes(hour);
  }
}
`,
  tests: [
    {
      name: {
        en: 'sends at the scheduled hour',
        es: 'manda a la hora programada',
        'pt-BR': 'envia no horário programado',
      },
      code: `const mailer = { send: fn() };
const clock = { now: () => new Date(2026, 4, 1, 9, 5) };
const scheduler = new DigestScheduler({ clock, mailer, hours: [9, 18] });
expect(scheduler.tick('Your daily digest')).toBe(true);
expect(mailer.send.calls).toEqual([['Your daily digest']]);`,
    },
    {
      name: {
        en: 'does not send outside the schedule',
        es: 'no manda fuera de horario',
        'pt-BR': 'não envia fora do horário',
      },
      code: `const mailer = { send: fn() };
const clock = { now: () => new Date(2026, 4, 1, 13, 0) };
const scheduler = new DigestScheduler({ clock, mailer, hours: [9, 18] });
expect(scheduler.tick('Digest')).toBe(false);
expect(mailer.send).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'only once per hour and per day',
        es: 'una sola vez por hora y por día',
        'pt-BR': 'uma única vez por hora e por dia',
      },
      code: `let now = new Date(2026, 4, 1, 18, 0);
const mailer = { send: fn() };
const scheduler = new DigestScheduler({ clock: { now: () => now }, mailer, hours: [18] });
scheduler.tick('Digest');
now = new Date(2026, 4, 1, 18, 40);
expect(scheduler.tick('Digest')).toBe(false);
now = new Date(2026, 4, 2, 18, 1);
expect(scheduler.tick('Digest')).toBe(true);
expect(mailer.send).toHaveBeenCalledTimes(2);`,
    },
  ],
  hints: {
    en: [
      'Store `clock` and `mailer` in the constructor instead of using `new Date()` and hidden effects.',
      'For "once per hour and per day", keep a key like `toDateString() + "-" + hour` of the last send.',
    ],
    es: [
      'Guardá `clock` y `mailer` en el constructor en lugar de usar `new Date()` y efectos ocultos.',
      'Para "una vez por hora y por día", guardá una clave como `toDateString() + "-" + hora` del último envío.',
    ],
    'pt-BR': [
      'Guarde `clock` e `mailer` no construtor em vez de usar `new Date()` e efeitos ocultos.',
      'Para "uma vez por hora e por dia", guarde uma chave como `toDateString() + "-" + hora` do último envio.',
    ],
  },
  solution: `class DigestScheduler {
  #lastSent = null;

  constructor({ clock, mailer, hours }) {
    this.clock = clock;
    this.mailer = mailer;
    this.hours = hours;
  }

  tick(subject) {
    const now = this.clock.now();
    const hour = now.getHours();
    const key = now.toDateString() + '-' + hour;
    if (!this.hours.includes(hour) || this.#lastSent === key) return false;
    this.mailer.send(subject);
    this.#lastSent = key;
    return true;
  }
}
`,
};
