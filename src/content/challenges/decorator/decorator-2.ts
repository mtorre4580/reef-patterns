import type { Challenge } from '../../types';

export const decorator2: Challenge = {
  id: 'decorator-2',
  patternId: 'decorator',
  title: {
    en: 'Pump with logging and a flow cap',
    es: 'Bomba con registro y límite de caudal',
    'pt-BR': 'Bomba com registro e limite de vazão',
  },
  difficulty: 'media',
  story: {
    en: "The wave pump accepts any flow. We want to log every change for debugging and, on the nano, cap the maximum flow so the sand doesn't fly. We can't touch the `Pump` class.",
    es: 'La bomba de olas acepta cualquier caudal. Queremos registrar cada cambio para depurar y, en el nano, limitar el caudal máximo para no volar la arena. No podemos tocar la clase `Pump`.',
    'pt-BR':
      'A bomba de ondas aceita qualquer vazão. Queremos registrar cada mudança para depurar e, no nano, limitar a vazão máxima para não levantar a areia. Não podemos mexer na classe `Pump`.',
  },
  instructions: {
    en: 'Without modifying `Pump`, implement two decorators that return objects with `setFlow(lph)` and `getFlow()`:\n- `withLogging(pump, log)`: before delegating, pushes `"setFlow <lph>"` into the `log` array.\n- `withMaxFlow(pump, max)`: delegates with `Math.min(lph, max)`.\nThey must nest: `withLogging(withMaxFlow(pump, 2000), log)`.',
    es: 'Sin modificar `Pump`, implementá dos decoradores que devuelvan objetos con `setFlow(lph)` y `getFlow()`:\n- `withLogging(pump, log)`: antes de delegar, agrega `"setFlow <lph>"` al array `log`.\n- `withMaxFlow(pump, max)`: delega con `Math.min(lph, max)`.\nSe tienen que poder anidar: `withLogging(withMaxFlow(pump, 2000), log)`.',
    'pt-BR':
      'Sem modificar `Pump`, implemente dois decoradores que devolvam objetos com `setFlow(lph)` e `getFlow()`:\n- `withLogging(pump, log)`: antes de delegar, adiciona `"setFlow <lph>"` ao array `log`.\n- `withMaxFlow(pump, max)`: delega com `Math.min(lph, max)`.\nPrecisam poder ser aninhados: `withLogging(withMaxFlow(pump, 2000), log)`.',
  },
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
      name: {
        en: 'withLogging records every change',
        es: 'withLogging registra cada cambio',
        'pt-BR': 'withLogging registra cada mudança',
      },
      code: `const log = [];
const pump = withLogging(new Pump(), log);
pump.setFlow(3000);
pump.setFlow(1200);
expect(log).toEqual(['setFlow 3000', 'setFlow 1200']);
expect(pump.getFlow()).toBe(1200);`,
    },
    {
      name: {
        en: 'withMaxFlow caps the flow',
        es: 'withMaxFlow limita el caudal',
        'pt-BR': 'withMaxFlow limita a vazão',
      },
      code: `const pump = withMaxFlow(new Pump(), 2000);
pump.setFlow(3500);
expect(pump.getFlow()).toBe(2000);
pump.setFlow(800);
expect(pump.getFlow()).toBe(800);`,
    },
    {
      name: {
        en: 'they nest: the request is logged and the cap applied',
        es: 'se anidan: se registra lo pedido y se aplica el límite',
        'pt-BR': 'aninham-se: registra-se o pedido e aplica-se o limite',
      },
      code: `const log = [];
const real = new Pump();
const pump = withLogging(withMaxFlow(real, 2000), log);
pump.setFlow(3500);
expect(log).toEqual(['setFlow 3500']);
expect(real.getFlow()).toBe(2000);`,
    },
    {
      name: {
        en: 'does not modify the original pump',
        es: 'no modifica la bomba original',
        'pt-BR': 'não modifica a bomba original',
      },
      code: `const real = new Pump();
withMaxFlow(real, 100);
real.setFlow(5000);
expect(real.getFlow()).toBe(5000);`,
    },
  ],
  hints: {
    en: [
      'Each decorator returns a new object with both methods.',
      "The decorator's `getFlow` just delegates: `() => pump.getFlow()`.",
    ],
    es: [
      'Cada decorador devuelve un objeto nuevo con los dos métodos.',
      '`getFlow` del decorador solo delega: `() => pump.getFlow()`.',
    ],
    'pt-BR': [
      'Cada decorador devolve um objeto novo com os dois métodos.',
      'O `getFlow` do decorador só delega: `() => pump.getFlow()`.',
    ],
  },
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
