import type { Challenge } from '../../types';

export const singleton1: Challenge = {
  id: 'singleton-1',
  patternId: 'singleton',
  title: 'Un solo controlador',
  difficulty: 'facil',
  story:
    'El dashboard y el programador de tareas crean cada uno su propio controlador del acuario. Uno apaga el skimmer y el otro sigue viéndolo encendido.',
  instructions:
    'Implementá `getController()`, que siempre devuelve la misma instancia de `ReefController`.\n' +
    '- `setDevice(name, on)` guarda el estado de un equipo.\n' +
    '- `isOn(name)` devuelve `true` o `false` (los equipos desconocidos están apagados).\n' +
    '- El estado tiene que persistir entre llamadas a `getController()`.',
  starterCode: `class ReefController {
  devices = {};

  setDevice(name, on) {
    this.devices[name] = on;
  }

  isOn(name) {
    return this.devices[name] ?? false;
  }
}

function getController() {
  return new ReefController();
}
`,
  tests: [
    {
      name: 'siempre devuelve la misma instancia',
      code: `expect(getController()).toBe(getController());`,
    },
    {
      name: 'el estado persiste entre llamadas',
      code: `getController().setDevice('skimmer', true);
expect(getController().isOn('skimmer')).toBe(true);
getController().setDevice('skimmer', false);
expect(getController().isOn('skimmer')).toBe(false);`,
    },
    {
      name: 'un equipo desconocido está apagado',
      code: `expect(getController().isOn('chiller')).toBe(false);`,
    },
  ],
  hints: [
    'Guardá la instancia en una variable fuera de la función, inicialmente `null`.',
    'En `getController`, creala solo si todavía no existe: `instance ??= new ReefController()`.',
  ],
  solution: `class ReefController {
  #devices = new Map();

  setDevice(name, on) {
    this.#devices.set(name, on);
  }

  isOn(name) {
    return this.#devices.get(name) ?? false;
  }
}

let instance = null;

function getController() {
  instance ??= new ReefController();
  return instance;
}
`,
};
