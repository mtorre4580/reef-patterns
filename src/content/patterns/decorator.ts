import type { Pattern } from '../types';

export const decorator: Pattern = {
  id: 'decorator',
  rank: 5,
  name: 'Decorator',
  nameEs: 'Decorador',
  category: 'estructural',
  tier: 1,
  gof: true,
  summary:
    'Envuelve un objeto para sumarle comportamiento sin modificar su clase, manteniendo la misma interfaz.',
  when: 'Cuando querés combinar capacidades opcionales (logging, caché, reintentos, extras) sin crear una subclase por cada combinación posible.',
  pros: [
    'Las capacidades se combinan libremente y en cualquier orden.',
    'Respeta el principio de responsabilidad única: cada envoltorio hace una cosa.',
    'Se agrega o quita comportamiento en tiempo de ejecución.',
  ],
  cons: [
    'Muchas capas pequeñas dificultan seguir la ejecución.',
    'El orden de las envolturas puede cambiar el resultado.',
  ],
  realWorld:
    'Middlewares que envuelven fetch, los HOC de React, los decoradores de TypeScript/Angular, wrappers como lodash.memoize.',
  example: {
    title: 'Equipo de buceo que suma capacidades',
    scenario:
      'Un buzo arranca con traje y tanque. Según la inmersión suma linterna para una cueva o cámara para fotografiar corales, y cada accesorio agrega peso y capacidades.',
    code: `const baseDiver = {
  gear: () => ['traje', 'tanque', 'regulador'],
  weightKg: () => 18,
};

// Cada decorador recibe un buzo y devuelve otro con la misma interfaz
const withTorch = (diver) => ({
  ...diver,
  gear: () => [...diver.gear(), 'linterna'],
  weightKg: () => diver.weightKg() + 0.8,
});

const withCamera = (diver) => ({
  ...diver,
  gear: () => [...diver.gear(), 'cámara con housing'],
  weightKg: () => diver.weightKg() + 2.5,
  canShoot: () => true,
});

const caveDiver = withTorch(baseDiver);
const photoDiver = withCamera(withTorch(baseDiver));

console.log(caveDiver.gear()); // [..., 'linterna']
console.log(photoDiver.gear(), photoDiver.weightKg()); // 21.3 kg`,
  },
  related: ['proxy', 'hoc', 'middleware', 'adapter'],
};
