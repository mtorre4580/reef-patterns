import type { Challenge } from '../../types';

export const facade1: Challenge = {
  id: 'facade-1',
  patternId: 'facade',
  title: { en: 'Maintenance mode', es: 'Modo mantenimiento', 'pt-BR': 'Modo manutenção' },
  difficulty: 'facil',
  story: {
    en: 'To clean the glass you must turn off the ATO, the skimmer and the return pump, in that order, and turn them back on in reverse when done. Last month someone started the skimmer with an empty sump.',
    es: 'Para limpiar el vidrio hay que apagar el ATO, el skimmer y la bomba de retorno, en ese orden, y al terminar encenderlos al revés. El mes pasado alguien prendió el skimmer con el sump vacío.',
    'pt-BR':
      'Para limpar o vidro é preciso desligar o ATO, o skimmer e a bomba de retorno, nessa ordem, e ao terminar ligá-los ao contrário. No mês passado alguém ligou o skimmer com o sump vazio.',
  },
  instructions: {
    en: 'Implement `TankFacade` with `constructor({ ato, skimmer, returnPump })`:\n- `maintenanceMode()`: turns off the ATO, the skimmer and the return pump, in that order.\n- `resume()`: turns them on in reverse order, but only the ones that were on before maintenance. Without a maintenance in progress it does nothing.\nEach device has `on`, `stop()` and `start()` (use `createDevice` to try it out).',
    es: 'Implementá `TankFacade` con `constructor({ ato, skimmer, returnPump })`:\n- `maintenanceMode()`: apaga ATO, skimmer y retorno, en ese orden.\n- `resume()`: los enciende en orden inverso, pero solo los que estaban encendidos antes del mantenimiento. Si no hubo mantenimiento, no hace nada.\nCada equipo tiene `on`, `stop()` y `start()` (usá `createDevice` para probar).',
    'pt-BR':
      'Implemente `TankFacade` com `constructor({ ato, skimmer, returnPump })`:\n- `maintenanceMode()`: desliga ATO, skimmer e retorno, nessa ordem.\n- `resume()`: liga-os na ordem inversa, mas só os que estavam ligados antes da manutenção. Se não houve manutenção, não faz nada.\nCada equipamento tem `on`, `stop()` e `start()` (use `createDevice` para testar).',
  },
  starterCode: `// Test device: logs every action into the shared log
function createDevice(name, log, on = true) {
  return {
    name,
    on,
    stop() { this.on = false; log.push('stop:' + name); },
    start() { this.on = true; log.push('start:' + name); },
  };
}

class TankFacade {
  constructor(devices) {
    this.devices = devices;
  }

  maintenanceMode() {}

  resume() {}
}
`,
  tests: [
    {
      name: {
        en: 'shuts down in the safe order',
        es: 'apaga en el orden seguro',
        'pt-BR': 'desliga na ordem segura',
      },
      code: `const log = [];
const tank = new TankFacade({
  ato: createDevice('ato', log),
  skimmer: createDevice('skimmer', log),
  returnPump: createDevice('return', log),
});
tank.maintenanceMode();
expect(log).toEqual(['stop:ato', 'stop:skimmer', 'stop:return']);`,
    },
    {
      name: {
        en: 'restores in reverse order',
        es: 'restaura en orden inverso',
        'pt-BR': 'restaura na ordem inversa',
      },
      code: `const log = [];
const tank = new TankFacade({
  ato: createDevice('ato', log),
  skimmer: createDevice('skimmer', log),
  returnPump: createDevice('return', log),
});
tank.maintenanceMode();
log.length = 0;
tank.resume();
expect(log).toEqual(['start:return', 'start:skimmer', 'start:ato']);`,
    },
    {
      name: {
        en: 'a device that was off stays off',
        es: 'un equipo que estaba apagado sigue apagado',
        'pt-BR': 'um equipamento que estava desligado continua desligado',
      },
      code: `const log = [];
const skimmer = createDevice('skimmer', log, false);
const tank = new TankFacade({ ato: createDevice('ato', log), skimmer, returnPump: createDevice('return', log) });
tank.maintenanceMode();
tank.resume();
expect(skimmer.on).toBe(false);`,
    },
    {
      name: {
        en: 'resume without maintenance does nothing',
        es: 'resume sin mantenimiento no hace nada',
        'pt-BR': 'resume sem manutenção não faz nada',
      },
      code: `const log = [];
const tank = new TankFacade({
  ato: createDevice('ato', log),
  skimmer: createDevice('skimmer', log),
  returnPump: createDevice('return', log),
});
tank.resume();
expect(log).toEqual([]);`,
    },
  ],
  hints: {
    en: [
      'Keep an array with the shutdown order: `[ato, skimmer, returnPump]`.',
      'Before shutting down, remember which devices were on (for example, a `Set` or an array of booleans).',
      'To restore, walk the array backwards with `toReversed()`.',
    ],
    es: [
      'Guardá un array con el orden de apagado: `[ato, skimmer, returnPump]`.',
      'Antes de apagar, recordá qué equipos estaban encendidos (por ejemplo, un `Set` o un array de booleanos).',
      'Para restaurar, recorré el array al revés con `toReversed()`.',
    ],
    'pt-BR': [
      'Guarde um array com a ordem de desligamento: `[ato, skimmer, returnPump]`.',
      'Antes de desligar, lembre quais equipamentos estavam ligados (por exemplo, um `Set` ou um array de booleanos).',
      'Para restaurar, percorra o array ao contrário com `toReversed()`.',
    ],
  },
  solution: `// Test device: logs every action into the shared log
function createDevice(name, log, on = true) {
  return {
    name,
    on,
    stop() { this.on = false; log.push('stop:' + name); },
    start() { this.on = true; log.push('start:' + name); },
  };
}

class TankFacade {
  #order;
  #wasOn = null;

  constructor({ ato, skimmer, returnPump }) {
    this.#order = [ato, skimmer, returnPump];
  }

  maintenanceMode() {
    this.#wasOn = new Set(this.#order.filter((d) => d.on));
    for (const device of this.#order) device.stop();
  }

  resume() {
    if (!this.#wasOn) return;
    for (const device of this.#order.toReversed()) {
      if (this.#wasOn.has(device)) device.start();
    }
    this.#wasOn = null;
  }
}
`,
};
