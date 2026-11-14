import type { Challenge } from '../../types';

export const decorator2: Challenge = {
  id: 'decorator-2',
  patternId: 'decorator',
  title: 'Bomba con registro y límite de caudal',
  difficulty: 'media',
  story:
    'La bomba de olas acepta cualquier caudal. Queremos registrar cada cambio para depurar y, en el nano, limitar el caudal máximo para no volar la arena. No podemos tocar la clase `Pump`.',
  instructions:
    'Sin modificar `Pump`, implementá dos decoradores que devuelvan objetos con `setFlow(lph)` y `getFlow()`:\n' +
    '- `withLogging(pump, log)`: antes de delegar, agrega `"setFlow <lph>"` al array `log`.\n' +
    '- `withMaxFlow(pump, max)`: delega con `Math.min(lph, max)`.\n' +
    'Se tienen que poder anidar: `withLogging(withMaxFlow(pump, 2000), log)`.',
  starterCode: `class Pump {
  #flow = 0;
  setFlow(lph) {
    this.#flow = lph;
  }
  getFlow() {
    return this.#flow;
  }
}

function withLogging(pump, log) {
  return pump;
}

function withMaxFlow(pump, max) {
  return pump;
}
`,
  tests: [
    {
      name: 'withLogging registra cada cambio',
      code: `const log = [];
const pump = withLogging(new Pump(), log);
pump.setFlow(3000);
pump.setFlow(1200);
expect(log).toEqual(['setFlow 3000', 'setFlow 1200']);
expect(pump.getFlow()).toBe(1200);`,
    },
    {
      name: 'withMaxFlow limita el caudal',
      code: `const pump = withMaxFlow(new Pump(), 2000);
pump.setFlow(3500);
expect(pump.getFlow()).toBe(2000);
pump.setFlow(800);
expect(pump.getFlow()).toBe(800);`,
    },
    {
      name: 'se anidan: se registra lo pedido y se aplica el límite',
      code: `const log = [];
const real = new Pump();
const pump = withLogging(withMaxFlow(real, 2000), log);
pump.setFlow(3500);
expect(log).toEqual(['setFlow 3500']);
expect(real.getFlow()).toBe(2000);`,
    },
    {
      name: 'no modifica la bomba original',
      code: `const real = new Pump();
withMaxFlow(real, 100);
real.setFlow(5000);
expect(real.getFlow()).toBe(5000);`,
    },
  ],
  hints: [
    'Cada decorador devuelve un objeto nuevo con los dos métodos.',
    '`getFlow` del decorador solo delega: `() => pump.getFlow()`.',
  ],
  solution: `class Pump {
  #flow = 0;
  setFlow(lph) {
    this.#flow = lph;
  }
  getFlow() {
    return this.#flow;
  }
}

function withLogging(pump, log) {
  return {
    setFlow(lph) {
      log.push('setFlow ' + lph);
      pump.setFlow(lph);
    },
    getFlow: () => pump.getFlow(),
  };
}

function withMaxFlow(pump, max) {
  return {
    setFlow: (lph) => pump.setFlow(Math.min(lph, max)),
    getFlow: () => pump.getFlow(),
  };
}
`,
};
