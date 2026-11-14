import type { Challenge } from '../../types';

export const singleton1: Challenge = {
  id: 'singleton-1',
  patternId: 'singleton',
  title: { en: 'A single controller', es: 'Un solo controlador', 'pt-BR': 'Um único controlador' },
  difficulty: 'facil',
  story: {
    en: 'The dashboard and the task scheduler each create their own tank controller. One turns off the skimmer and the other still sees it on.',
    es: 'El dashboard y el programador de tareas crean cada uno su propio controlador del acuario. Uno apaga el skimmer y el otro sigue viéndolo encendido.',
    'pt-BR':
      'O dashboard e o agendador de tarefas criam cada um seu próprio controlador do aquário. Um desliga o skimmer e o outro continua vendo-o ligado.',
  },
  instructions: {
    en: 'Implement `getController()`, which always returns the same `ReefController` instance.\n- `setDevice(name, on)` stores the state of a device.\n- `isOn(name)` returns `true` or `false` (unknown devices are off).\n- The state must persist across calls to `getController()`.',
    es: 'Implementá `getController()`, que siempre devuelve la misma instancia de `ReefController`.\n- `setDevice(name, on)` guarda el estado de un equipo.\n- `isOn(name)` devuelve `true` o `false` (los equipos desconocidos están apagados).\n- El estado tiene que persistir entre llamadas a `getController()`.',
    'pt-BR':
      'Implemente `getController()`, que sempre devolve a mesma instância de `ReefController`.\n- `setDevice(name, on)` guarda o estado de um equipamento.\n- `isOn(name)` devolve `true` ou `false` (equipamentos desconhecidos estão desligados).\n- O estado precisa persistir entre chamadas a `getController()`.',
  },
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
      name: {
        en: 'always returns the same instance',
        es: 'siempre devuelve la misma instancia',
        'pt-BR': 'sempre devolve a mesma instância',
      },
      code: `expect(getController()).toBe(getController());`,
    },
    {
      name: {
        en: 'state persists across calls',
        es: 'el estado persiste entre llamadas',
        'pt-BR': 'o estado persiste entre chamadas',
      },
      code: `getController().setDevice('skimmer', true);
expect(getController().isOn('skimmer')).toBe(true);
getController().setDevice('skimmer', false);
expect(getController().isOn('skimmer')).toBe(false);`,
    },
    {
      name: {
        en: 'an unknown device is off',
        es: 'un equipo desconocido está apagado',
        'pt-BR': 'um equipamento desconhecido está desligado',
      },
      code: `expect(getController().isOn('chiller')).toBe(false);`,
    },
  ],
  hints: {
    en: [
      'Keep the instance in a variable outside the function, initially `null`.',
      'In `getController`, only create it if it does not exist yet: `instance ??= new ReefController()`.',
    ],
    es: [
      'Guardá la instancia en una variable fuera de la función, inicialmente `null`.',
      'En `getController`, creala solo si todavía no existe: `instance ??= new ReefController()`.',
    ],
    'pt-BR': [
      'Guarde a instância em uma variável fora da função, inicialmente `null`.',
      'Em `getController`, crie-a só se ainda não existir: `instance ??= new ReefController()`.',
    ],
  },
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
