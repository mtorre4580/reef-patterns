import type { Challenge } from '../../types';

export const facade2: Challenge = {
  id: 'facade-2',
  patternId: 'facade',
  title: 'Reservar una salida en una llamada',
  difficulty: 'media',
  story:
    'Reservar una salida de buceo implica consultar el clima, alquilar equipo y reservar el barco. La app de la escuela repite esa coreografía en tres pantallas, cada una con un bug distinto.',
  instructions:
    'Implementá `DiveTrip` con `constructor({ weather, gear, boat })` y `plan(site, divers)`:\n' +
    '1. `weather.check(site)` devuelve `{ ok }`. Si no está ok, lanzá `Error("Mar picado en <site>")` sin reservar nada.\n' +
    '2. `gear.reserve(divers)` devuelve un id de reserva.\n' +
    '3. `boat.book(site, divers)` devuelve la reserva del barco. Si falla, llamá a `gear.release(id)` y volvé a lanzar el error.\n' +
    'Devolvé `{ site, divers, gearId, booking }`.',
  starterCode: `class DiveTrip {
  constructor(services) {
    this.services = services;
  }

  plan(site, divers) {
    // Coordiná clima, equipo y barco
  }
}
`,
  tests: [
    {
      name: 'coordina los tres servicios',
      code: `const weather = { check: fn(() => ({ ok: true })) };
const gear = { reserve: fn(() => 'G-7'), release: fn() };
const boat = { book: fn(() => 'B-12') };
const trip = new DiveTrip({ weather, gear, boat }).plan('Bajo Rojo', 4);
expect(trip).toEqual({ site: 'Bajo Rojo', divers: 4, gearId: 'G-7', booking: 'B-12' });
expect(boat.book.calls).toEqual([['Bajo Rojo', 4]]);`,
    },
    {
      name: 'con mal clima no reserva nada',
      code: `const weather = { check: fn(() => ({ ok: false })) };
const gear = { reserve: fn(), release: fn() };
const boat = { book: fn() };
const facade = new DiveTrip({ weather, gear, boat });
expect(() => facade.plan('La Pared', 2)).toThrow('Mar picado en La Pared');
expect(gear.reserve).toHaveBeenCalledTimes(0);
expect(boat.book).toHaveBeenCalledTimes(0);`,
    },
    {
      name: 'si el barco falla, libera el equipo',
      code: `const weather = { check: () => ({ ok: true }) };
const gear = { reserve: () => 'G-9', release: fn() };
const boat = { book: () => { throw new Error('Barco completo'); } };
const facade = new DiveTrip({ weather, gear, boat });
expect(() => facade.plan('El Naufragio', 6)).toThrow('Barco completo');
expect(gear.release.calls).toEqual([['G-9']]);`,
    },
  ],
  hints: [
    'La fachada solo coordina: cada paso es una llamada a un servicio.',
    'Envolvé `boat.book` en `try/catch`; en el `catch`, liberá el equipo y hacé `throw error`.',
  ],
  solution: `class DiveTrip {
  constructor({ weather, gear, boat }) {
    this.weather = weather;
    this.gear = gear;
    this.boat = boat;
  }

  plan(site, divers) {
    if (!this.weather.check(site).ok) throw new Error('Mar picado en ' + site);
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
