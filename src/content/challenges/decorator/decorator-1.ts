import type { Challenge } from '../../types';

export const decorator1: Challenge = {
  id: 'decorator-1',
  patternId: 'decorator',
  title: 'Accesorios de buceo',
  difficulty: 'facil',
  story:
    'Cada buzo arranca con traje, tanque y regulador. Según la inmersión suma linterna o cámara. Hacer una subclase por combinación (BuzoConLinternaYCamara…) ya no escala.',
  instructions:
    'Dado `baseDiver` (con `gear()` y `weightKg()`), implementá dos decoradores que devuelvan un buzo nuevo con la misma interfaz, sin modificar el original:\n' +
    '- `withTorch(diver)`: suma `"linterna"` al final de `gear()` y 1 kg.\n' +
    '- `withCamera(diver)`: suma `"cámara"` y 3 kg, y agrega `canShoot()` que devuelve `true`.\n' +
    'Tienen que poder combinarse en cualquier orden y con cualquier buzo.',
  starterCode: `const baseDiver = {
  gear: () => ['traje', 'tanque', 'regulador'],
  weightKg: () => 18,
};

function withTorch(diver) {
  diver.gear = () => ['traje', 'tanque', 'regulador', 'linterna'];
  return diver;
}

function withCamera(diver) {
  return diver;
}
`,
  tests: [
    {
      name: 'withTorch suma la linterna y su peso',
      code: `const diver = withTorch(baseDiver);
expect(diver.gear()).toEqual(['traje', 'tanque', 'regulador', 'linterna']);
expect(diver.weightKg()).toBe(19);`,
    },
    {
      name: 'no modifica al buzo original',
      code: `withCamera(withTorch(baseDiver));
expect(baseDiver.gear()).toEqual(['traje', 'tanque', 'regulador']);
expect(baseDiver.weightKg()).toBe(18);`,
    },
    {
      name: 'se combinan en cualquier orden',
      code: `const a = withCamera(withTorch(baseDiver));
const b = withTorch(withCamera(baseDiver));
expect(a.weightKg()).toBe(22);
expect(b.weightKg()).toBe(22);
expect(a.gear().at(-1)).toBe('cámara');
expect(b.gear().at(-1)).toBe('linterna');
expect(b.canShoot()).toBe(true);`,
    },
    {
      name: 'funciona con cualquier buzo',
      code: `const freediver = { gear: () => ['aletas'], weightKg: () => 2 };
expect(withTorch(freediver).gear()).toEqual(['aletas', 'linterna']);`,
    },
  ],
  hints: [
    'Devolvé un objeto nuevo: `{ ...diver, gear: () => [...diver.gear(), "linterna"] }`.',
    'Para el peso, llamá al del buzo envuelto: `weightKg: () => diver.weightKg() + 1`.',
  ],
  solution: `const baseDiver = {
  gear: () => ['traje', 'tanque', 'regulador'],
  weightKg: () => 18,
};

function withTorch(diver) {
  return {
    ...diver,
    gear: () => [...diver.gear(), 'linterna'],
    weightKg: () => diver.weightKg() + 1,
  };
}

function withCamera(diver) {
  return {
    ...diver,
    gear: () => [...diver.gear(), 'cámara'],
    weightKg: () => diver.weightKg() + 3,
    canShoot: () => true,
  };
}
`,
};
