import type { Challenge } from '../../types';

export const decorator2: Challenge = {
  id: 'decorator-2',
  patternId: 'decorator',
  title: {
    en: 'Image resizer with logging and a width cap',
    es: 'Redimensionador con logging y ancho máximo',
    'pt-BR': 'Redimensionador com logging e largura máxima',
  },
  difficulty: 'media',
  story: {
    en: 'The image service resizes uploads to any width. We want to log every change for debugging and, for avatars, cap the width at 512 px. We cannot touch the `Resizer` class, which comes from another team.',
    es: 'El servicio de imágenes redimensiona las subidas a cualquier ancho. Queremos registrar cada cambio para depurar y, para avatares, limitar el ancho a 512 px. No podemos tocar la clase `Resizer`, que es de otro equipo.',
    'pt-BR':
      'O serviço de imagens redimensiona os uploads para qualquer largura. Queremos registrar cada mudança para depurar e, para avatares, limitar a largura a 512 px. Não podemos mexer na classe `Resizer`, que é de outro time.',
  },
  instructions: {
    en: 'Without modifying `Resizer`, implement two decorators that return objects with `setWidth(px)` and `getWidth()`:\n- `withLogging(resizer, log)`: before delegating, pushes `"setWidth <px>"` into the `log` array.\n- `withMaxWidth(resizer, max)`: delegates with `Math.min(px, max)`.\nThey must nest: `withLogging(withMaxWidth(resizer, 512), log)`.',
    es: 'Sin modificar `Resizer`, implementá dos decoradores que devuelvan objetos con `setWidth(px)` y `getWidth()`:\n- `withLogging(resizer, log)`: antes de delegar, agrega `"setWidth <px>"` al array `log`.\n- `withMaxWidth(resizer, max)`: delega con `Math.min(px, max)`.\nSe tienen que poder anidar: `withLogging(withMaxWidth(resizer, 512), log)`.',
    'pt-BR':
      'Sem modificar `Resizer`, implemente dois decoradores que devolvam objetos com `setWidth(px)` e `getWidth()`:\n- `withLogging(resizer, log)`: antes de delegar, adiciona `"setWidth <px>"` ao array `log`.\n- `withMaxWidth(resizer, max)`: delega com `Math.min(px, max)`.\nPrecisam poder ser aninhados: `withLogging(withMaxWidth(resizer, 512), log)`.',
  },
  starterCode: `class Resizer {
  #width = 0;
  setWidth(px) {
    this.#width = px;
  }
  getWidth() {
    return this.#width;
  }
}

function withLogging(resizer, log) {
  return resizer;
}

function withMaxWidth(resizer, max) {
  return resizer;
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
const resizer = withLogging(new Resizer(), log);
resizer.setWidth(1200);
resizer.setWidth(800);
expect(log).toEqual(['setWidth 1200', 'setWidth 800']);
expect(resizer.getWidth()).toBe(800);`,
    },
    {
      name: {
        en: 'withMaxWidth caps the width',
        es: 'withMaxWidth limita el ancho',
        'pt-BR': 'withMaxWidth limita a largura',
      },
      code: `const resizer = withMaxWidth(new Resizer(), 512);
resizer.setWidth(2000);
expect(resizer.getWidth()).toBe(512);
resizer.setWidth(300);
expect(resizer.getWidth()).toBe(300);`,
    },
    {
      name: {
        en: 'they nest: the request is logged and the cap applied',
        es: 'se anidan: se registra lo pedido y se aplica el límite',
        'pt-BR': 'aninham-se: registra-se o pedido e aplica-se o limite',
      },
      code: `const log = [];
const real = new Resizer();
const resizer = withLogging(withMaxWidth(real, 512), log);
resizer.setWidth(2000);
expect(log).toEqual(['setWidth 2000']);
expect(real.getWidth()).toBe(512);`,
    },
    {
      name: {
        en: 'does not modify the original resizer',
        es: 'no modifica el redimensionador original',
        'pt-BR': 'não modifica o redimensionador original',
      },
      code: `const real = new Resizer();
withMaxWidth(real, 100);
real.setWidth(5000);
expect(real.getWidth()).toBe(5000);`,
    },
  ],
  hints: {
    en: [
      'Each decorator returns a new object with both methods.',
      "The decorator's `getWidth` just delegates: `() => resizer.getWidth()`.",
    ],
    es: [
      'Cada decorador devuelve un objeto nuevo con los dos métodos.',
      'El `getWidth` del decorador solo delega: `() => resizer.getWidth()`.',
    ],
    'pt-BR': [
      'Cada decorador devolve um objeto novo com os dois métodos.',
      'O `getWidth` do decorador só delega: `() => resizer.getWidth()`.',
    ],
  },
  solution: `class Resizer {
  #width = 0;
  setWidth(px) {
    this.#width = px;
  }
  getWidth() {
    return this.#width;
  }
}

function withLogging(resizer, log) {
  return {
    setWidth(px) {
      log.push('setWidth ' + px);
      resizer.setWidth(px);
    },
    getWidth: () => resizer.getWidth(),
  };
}

function withMaxWidth(resizer, max) {
  return {
    setWidth: (px) => resizer.setWidth(Math.min(px, max)),
    getWidth: () => resizer.getWidth(),
  };
}
`,
};
