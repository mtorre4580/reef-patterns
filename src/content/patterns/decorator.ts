import type { Pattern } from '../types';

export const decorator: Pattern = {
  id: 'decorator',
  rank: 5,
  name: 'Decorator',
  localName: { en: 'Decorator', es: 'Decorador', 'pt-BR': 'Decorador' },
  category: 'estructural',
  tier: 1,
  gof: true,
  summary: {
    en: 'Wraps an object to add behavior without changing its class, keeping the same interface.',
    es: 'Envuelve un objeto para sumarle comportamiento sin modificar su clase, manteniendo la misma interfaz.',
    'pt-BR':
      'Envolve um objeto para somar comportamento sem modificar sua classe, mantendo a mesma interface.',
  },
  when: {
    en: 'When you want to combine optional capabilities (logging, caching, retries, extras) without creating a subclass for every possible combination.',
    es: 'Cuando querés combinar capacidades opcionales (logging, caché, reintentos, extras) sin crear una subclase por cada combinación posible.',
    'pt-BR':
      'Quando você quer combinar capacidades opcionais (logging, cache, novas tentativas, extras) sem criar uma subclasse para cada combinação possível.',
  },
  pros: {
    en: [
      'Capabilities combine freely and in any order.',
      'Follows single responsibility: each wrapper does one thing.',
      'Behavior can be added or removed at runtime.',
    ],
    es: [
      'Las capacidades se combinan libremente y en cualquier orden.',
      'Respeta el principio de responsabilidad única: cada envoltorio hace una cosa.',
      'Se agrega o quita comportamiento en tiempo de ejecución.',
    ],
    'pt-BR': [
      'As capacidades se combinam livremente e em qualquer ordem.',
      'Respeita a responsabilidade única: cada invólucro faz uma coisa.',
      'Comportamento é adicionado ou removido em tempo de execução.',
    ],
  },
  cons: {
    en: [
      'Many thin layers make execution harder to follow.',
      'The wrapping order can change the result.',
    ],
    es: [
      'Muchas capas pequeñas dificultan seguir la ejecución.',
      'El orden de las envolturas puede cambiar el resultado.',
    ],
    'pt-BR': [
      'Muitas camadas pequenas dificultam acompanhar a execução.',
      'A ordem dos invólucros pode mudar o resultado.',
    ],
  },
  realWorld: {
    en: 'Middlewares that wrap fetch, React HOCs, TypeScript/Angular decorators, wrappers such as lodash.memoize.',
    es: 'Middlewares que envuelven fetch, los HOC de React, los decoradores de TypeScript/Angular, wrappers como lodash.memoize.',
    'pt-BR':
      'Middlewares que envolvem o fetch, os HOCs do React, os decorators do TypeScript/Angular, wrappers como lodash.memoize.',
  },
  example: {
    title: {
      en: 'Dive gear that adds capabilities',
      es: 'Equipo de buceo que suma capacidades',
      'pt-BR': 'Equipamento de mergulho que soma capacidades',
    },
    scenario: {
      en: 'A diver starts with a wetsuit and a tank. Depending on the dive, they add a torch for a cave or a camera to photograph corals, and each accessory adds weight and capabilities.',
      es: 'Un buzo arranca con traje y tanque. Según la inmersión suma linterna para una cueva o cámara para fotografiar corales, y cada accesorio agrega peso y capacidades.',
      'pt-BR':
        'Um mergulhador começa com roupa e cilindro. Conforme o mergulho, soma uma lanterna para uma caverna ou uma câmera para fotografar corais, e cada acessório adiciona peso e capacidades.',
    },
    code: `const baseDiver = {
  gear: () => ['wetsuit', 'tank', 'regulator'],
  weightKg: () => 18,
};

// Each decorator receives a diver and returns another one with the same interface
const withTorch = (diver) => ({
  ...diver,
  gear: () => [...diver.gear(), 'torch'],
  weightKg: () => diver.weightKg() + 0.8,
});

const withCamera = (diver) => ({
  ...diver,
  gear: () => [...diver.gear(), 'camera with housing'],
  weightKg: () => diver.weightKg() + 2.5,
  canShoot: () => true,
});

const caveDiver = withTorch(baseDiver);
const photoDiver = withCamera(withTorch(baseDiver));

console.log(caveDiver.gear()); // [..., 'torch']
console.log(photoDiver.gear(), photoDiver.weightKg()); // 21.3 kg`,
  },
  related: ['proxy', 'hoc', 'middleware', 'adapter'],
};
