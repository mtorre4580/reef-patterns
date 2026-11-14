import type { Challenge } from '../../types';

export const decorator1: Challenge = {
  id: 'decorator-1',
  patternId: 'decorator',
  title: { en: 'Dive accessories', es: 'Accesorios de buceo', 'pt-BR': 'Acessórios de mergulho' },
  difficulty: 'facil',
  story: {
    en: 'Every diver starts with a wetsuit, a tank and a regulator. Depending on the dive they add a torch or a camera. A subclass per combination (DiverWithTorchAndCamera…) no longer scales.',
    es: 'Cada buzo arranca con traje, tanque y regulador. Según la inmersión suma linterna o cámara. Hacer una subclase por combinación (BuzoConLinternaYCamara…) ya no escala.',
    'pt-BR':
      'Todo mergulhador começa com roupa, cilindro e regulador. Conforme o mergulho, soma lanterna ou câmera. Fazer uma subclasse por combinação (MergulhadorComLanternaECamera…) já não escala.',
  },
  instructions: {
    en: 'Given `baseDiver` (with `gear()` and `weightKg()`), implement two decorators that return a new diver with the same interface, without modifying the original:\n- `withTorch(diver)`: appends `"torch"` to `gear()` and adds 1 kg.\n- `withCamera(diver)`: appends `"camera"`, adds 3 kg and adds `canShoot()`, which returns `true`.\nThey must combine in any order and with any diver.',
    es: 'Dado `baseDiver` (con `gear()` y `weightKg()`), implementá dos decoradores que devuelvan un buzo nuevo con la misma interfaz, sin modificar el original:\n- `withTorch(diver)`: suma `"torch"` al final de `gear()` y 1 kg.\n- `withCamera(diver)`: suma `"camera"` y 3 kg, y agrega `canShoot()` que devuelve `true`.\nTienen que poder combinarse en cualquier orden y con cualquier buzo.',
    'pt-BR':
      'Dado `baseDiver` (com `gear()` e `weightKg()`), implemente dois decoradores que devolvam um mergulhador novo com a mesma interface, sem modificar o original:\n- `withTorch(diver)`: adiciona `"torch"` ao final de `gear()` e 1 kg.\n- `withCamera(diver)`: adiciona `"camera"` e 3 kg, e acrescenta `canShoot()`, que devolve `true`.\nPrecisam poder ser combinados em qualquer ordem e com qualquer mergulhador.',
  },
  starterCode: `const baseDiver = {
  gear: () => ['wetsuit', 'tank', 'regulator'],
  weightKg: () => 18,
};

function withTorch(diver) {
  diver.gear = () => ['wetsuit', 'tank', 'regulator', 'torch'];
  return diver;
}

function withCamera(diver) {
  return diver;
}
`,
  tests: [
    {
      name: {
        en: 'withTorch adds the torch and its weight',
        es: 'withTorch suma la linterna y su peso',
        'pt-BR': 'withTorch adiciona a lanterna e seu peso',
      },
      code: `const diver = withTorch(baseDiver);
expect(diver.gear()).toEqual(['wetsuit', 'tank', 'regulator', 'torch']);
expect(diver.weightKg()).toBe(19);`,
    },
    {
      name: {
        en: 'does not modify the original diver',
        es: 'no modifica al buzo original',
        'pt-BR': 'não modifica o mergulhador original',
      },
      code: `withCamera(withTorch(baseDiver));
expect(baseDiver.gear()).toEqual(['wetsuit', 'tank', 'regulator']);
expect(baseDiver.weightKg()).toBe(18);`,
    },
    {
      name: {
        en: 'they combine in any order',
        es: 'se combinan en cualquier orden',
        'pt-BR': 'combinam-se em qualquer ordem',
      },
      code: `const a = withCamera(withTorch(baseDiver));
const b = withTorch(withCamera(baseDiver));
expect(a.weightKg()).toBe(22);
expect(b.weightKg()).toBe(22);
expect(a.gear().at(-1)).toBe('camera');
expect(b.gear().at(-1)).toBe('torch');
expect(b.canShoot()).toBe(true);`,
    },
    {
      name: {
        en: 'works with any diver',
        es: 'funciona con cualquier buzo',
        'pt-BR': 'funciona com qualquer mergulhador',
      },
      code: `const freediver = { gear: () => ['fins'], weightKg: () => 2 };
expect(withTorch(freediver).gear()).toEqual(['fins', 'torch']);`,
    },
  ],
  hints: {
    en: [
      'Return a new object: `{ ...diver, gear: () => [...diver.gear(), "torch"] }`.',
      "For the weight, call the wrapped diver's: `weightKg: () => diver.weightKg() + 1`.",
    ],
    es: [
      'Devolvé un objeto nuevo: `{ ...diver, gear: () => [...diver.gear(), "torch"] }`.',
      'Para el peso, llamá al del buzo envuelto: `weightKg: () => diver.weightKg() + 1`.',
    ],
    'pt-BR': [
      'Devolva um objeto novo: `{ ...diver, gear: () => [...diver.gear(), "torch"] }`.',
      'Para o peso, chame o do mergulhador envolvido: `weightKg: () => diver.weightKg() + 1`.',
    ],
  },
  solution: `const baseDiver = {
  gear: () => ['wetsuit', 'tank', 'regulator'],
  weightKg: () => 18,
};

function withTorch(diver) {
  return {
    ...diver,
    gear: () => [...diver.gear(), 'torch'],
    weightKg: () => diver.weightKg() + 1,
  };
}

function withCamera(diver) {
  return {
    ...diver,
    gear: () => [...diver.gear(), 'camera'],
    weightKg: () => diver.weightKg() + 3,
    canShoot: () => true,
  };
}
`,
};
