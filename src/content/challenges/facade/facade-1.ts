import type { Challenge } from '../../types';

export const facade1: Challenge = {
  id: 'facade-1',
  patternId: 'facade',
  title: 'Modo mantenimiento',
  difficulty: 'facil',
  story:
    'Para limpiar el vidrio hay que apagar el ATO, el skimmer y la bomba de retorno, en ese orden, y al terminar encenderlos al revés. El mes pasado alguien prendió el skimmer con el sump vacío.',
  instructions:
    'Implementá `TankFacade` con `constructor({ ato, skimmer, returnPump })`:\n' +
    '- `maintenanceMode()`: apaga ATO, skimmer y retorno, en ese orden.\n' +
    '- `resume()`: los enciende en orden inverso, pero solo los que estaban encendidos antes del mantenimiento. Si no hubo mantenimiento, no hace nada.\n' +
    'Cada equipo tiene `on`, `stop()` y `start()` (usá `createDevice` para probar).',
  starterCode: `// Equipo de prueba: registra cada acción en el log compartido
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
      name: 'apaga en el orden seguro',
      code: `const log = [];
const tank = new TankFacade({
  ato: createDevice('ato', log),
  skimmer: createDevice('skimmer', log),
  returnPump: createDevice('retorno', log),
});
tank.maintenanceMode();
expect(log).toEqual(['stop:ato', 'stop:skimmer', 'stop:retorno']);`,
    },
    {
      name: 'restaura en orden inverso',
      code: `const log = [];
const tank = new TankFacade({
  ato: createDevice('ato', log),
  skimmer: createDevice('skimmer', log),
  returnPump: createDevice('retorno', log),
});
tank.maintenanceMode();
log.length = 0;
tank.resume();
expect(log).toEqual(['start:retorno', 'start:skimmer', 'start:ato']);`,
    },
    {
      name: 'un equipo que estaba apagado sigue apagado',
      code: `const log = [];
const skimmer = createDevice('skimmer', log, false);
const tank = new TankFacade({ ato: createDevice('ato', log), skimmer, returnPump: createDevice('retorno', log) });
tank.maintenanceMode();
tank.resume();
expect(skimmer.on).toBe(false);`,
    },
    {
      name: 'resume sin mantenimiento no hace nada',
      code: `const log = [];
const tank = new TankFacade({
  ato: createDevice('ato', log),
  skimmer: createDevice('skimmer', log),
  returnPump: createDevice('retorno', log),
});
tank.resume();
expect(log).toEqual([]);`,
    },
  ],
  hints: [
    'Guardá un array con el orden de apagado: `[ato, skimmer, returnPump]`.',
    'Antes de apagar, recordá qué equipos estaban encendidos (por ejemplo, un `Set` o un array de booleanos).',
    'Para restaurar, recorré el array al revés con `toReversed()`.',
  ],
  solution: `// Equipo de prueba: registra cada acción en el log compartido
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
