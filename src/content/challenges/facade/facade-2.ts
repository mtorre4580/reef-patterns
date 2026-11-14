import type { Challenge } from '../../types';

export const facade2: Challenge = {
  id: 'facade-2',
  patternId: 'facade',
  title: {
    en: 'Book a trip in one call',
    es: 'Reservar una salida en una llamada',
    'pt-BR': 'Reservar uma saída em uma chamada',
  },
  difficulty: 'media',
  story: {
    en: "Booking a dive trip means checking the weather, renting gear and booking the boat. The school's app repeats that choreography on three screens, each with a different bug.",
    es: 'Reservar una salida de buceo implica consultar el clima, alquilar equipo y reservar el barco. La app de la escuela repite esa coreografía en tres pantallas, cada una con un bug distinto.',
    'pt-BR':
      'Reservar uma saída de mergulho implica consultar o clima, alugar equipamento e reservar o barco. O app da escola repete essa coreografia em três telas, cada uma com um bug diferente.',
  },
  instructions: {
    en: 'Implement `DiveTrip` with `constructor({ weather, gear, boat })` and `plan(site, divers)`:\n1. `weather.check(site)` returns `{ ok }`. If it is not ok, throw `Error("Rough sea at <site>")` without booking anything.\n2. `gear.reserve(divers)` returns a booking id.\n3. `boat.book(site, divers)` returns the boat booking. If it fails, call `gear.release(id)` and rethrow the error.\nReturn `{ site, divers, gearId, booking }`.',
    es: 'Implementá `DiveTrip` con `constructor({ weather, gear, boat })` y `plan(site, divers)`:\n1. `weather.check(site)` devuelve `{ ok }`. Si no está ok, lanzá `Error("Rough sea at <site>")` sin reservar nada.\n2. `gear.reserve(divers)` devuelve un id de reserva.\n3. `boat.book(site, divers)` devuelve la reserva del barco. Si falla, llamá a `gear.release(id)` y volvé a lanzar el error.\nDevolvé `{ site, divers, gearId, booking }`.',
    'pt-BR':
      'Implemente `DiveTrip` com `constructor({ weather, gear, boat })` e `plan(site, divers)`:\n1. `weather.check(site)` devolve `{ ok }`. Se não estiver ok, lance `Error("Rough sea at <site>")` sem reservar nada.\n2. `gear.reserve(divers)` devolve um id de reserva.\n3. `boat.book(site, divers)` devolve a reserva do barco. Se falhar, chame `gear.release(id)` e relance o erro.\nDevolva `{ site, divers, gearId, booking }`.',
  },
  starterCode: `class DiveTrip {
  constructor(services) {
    this.services = services;
  }

  plan(site, divers) {
    // Coordinate weather, gear and boat
  }
}
`,
  tests: [
    {
      name: {
        en: 'coordinates the three services',
        es: 'coordina los tres servicios',
        'pt-BR': 'coordena os três serviços',
      },
      code: `const weather = { check: fn(() => ({ ok: true })) };
const gear = { reserve: fn(() => 'G-7'), release: fn() };
const boat = { book: fn(() => 'B-12') };
const trip = new DiveTrip({ weather, gear, boat }).plan('Red Shoal', 4);
expect(trip).toEqual({ site: 'Red Shoal', divers: 4, gearId: 'G-7', booking: 'B-12' });
expect(boat.book.calls).toEqual([['Red Shoal', 4]]);`,
    },
    {
      name: {
        en: 'with bad weather nothing is booked',
        es: 'con mal clima no reserva nada',
        'pt-BR': 'com mau tempo não reserva nada',
      },
      code: `const weather = { check: fn(() => ({ ok: false })) };
const gear = { reserve: fn(), release: fn() };
const boat = { book: fn() };
const facade = new DiveTrip({ weather, gear, boat });
expect(() => facade.plan('The Wall', 2)).toThrow('Rough sea at The Wall');
expect(gear.reserve).toHaveBeenCalledTimes(0);
expect(boat.book).toHaveBeenCalledTimes(0);`,
    },
    {
      name: {
        en: 'if the boat fails, the gear is released',
        es: 'si el barco falla, libera el equipo',
        'pt-BR': 'se o barco falhar, libera o equipamento',
      },
      code: `const weather = { check: () => ({ ok: true }) };
const gear = { reserve: () => 'G-9', release: fn() };
const boat = { book: () => { throw new Error('Boat is full'); } };
const facade = new DiveTrip({ weather, gear, boat });
expect(() => facade.plan('The Wreck', 6)).toThrow('Boat is full');
expect(gear.release.calls).toEqual([['G-9']]);`,
    },
  ],
  hints: {
    en: [
      'The facade only coordinates: each step is a call to a service.',
      'Wrap `boat.book` in `try/catch`; in the `catch`, release the gear and `throw error`.',
    ],
    es: [
      'La fachada solo coordina: cada paso es una llamada a un servicio.',
      'Envolvé `boat.book` en `try/catch`; en el `catch`, liberá el equipo y hacé `throw error`.',
    ],
    'pt-BR': [
      'A fachada só coordena: cada passo é uma chamada a um serviço.',
      'Envolva `boat.book` em `try/catch`; no `catch`, libere o equipamento e faça `throw error`.',
    ],
  },
  solution: `class DiveTrip {
  constructor({ weather, gear, boat }) {
    this.weather = weather;
    this.gear = gear;
    this.boat = boat;
  }

  plan(site, divers) {
    if (!this.weather.check(site).ok) throw new Error('Rough sea at ' + site);
    const gearId = this.gear.reserve(divers);
    try {
      const booking = this.boat.book(site, divers);
      return { site, divers, gearId, booking };
    } catch (error) {
      this.gear.release(gearId);
      throw error;
    }
  }
}
`,
};
