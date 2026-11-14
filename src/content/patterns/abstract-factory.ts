import type { Pattern } from '../types';

export const abstractFactory: Pattern = {
  id: 'abstract-factory',
  rank: 22,
  name: 'Abstract Factory',
  nameEs: 'Fábrica abstracta',
  category: 'creacional',
  tier: 2,
  gof: true,
  summary:
    'Una fábrica crea familias de objetos relacionados que están garantizados de ser compatibles entre sí.',
  when: 'Cuando necesitás crear varios objetos que tienen que combinar (por marca, plataforma o tema) y mezclar familias sería un error.',
  pros: [
    'Garantiza la compatibilidad entre los productos de una familia.',
    'Cambiar de familia es cambiar una sola fábrica.',
  ],
  cons: [
    'Agregar un producto nuevo obliga a tocar todas las fábricas.',
    'Mucha estructura para pocas variantes.',
  ],
  realWorld:
    'Los temas de librerías de UI que entregan botones, inputs y diálogos coherentes; los drivers de bases de datos que crean conexión, consulta y transacción.',
  example: {
    title: 'Kits de iluminación por marca',
    scenario:
      'Cada marca tiene su lámpara, su controlador y su perfil de amanecer. Un controlador de una marca no entiende los perfiles de otra, así que el kit se arma completo desde una fábrica.',
    code: `const abyssLightFactory = {
  createLamp: () => ({ brand: 'Abyss', channels: ['azul', 'blanco', 'UV'] }),
  createController: () => ({ brand: 'Abyss', protocol: 'abyss-link' }),
  createProfile: () => ({ brand: 'Abyss', sunrise: '10:00', peak: 85 }),
};

const lagoonLightFactory = {
  createLamp: () => ({ brand: 'Lagoon', channels: ['royal', 'cool white', 'violeta'] }),
  createController: () => ({ brand: 'Lagoon', protocol: 'wifi-lgn' }),
  createProfile: () => ({ brand: 'Lagoon', sunrise: '11:00', peak: 70 }),
};

function setupLighting(factory) {
  const lamp = factory.createLamp();
  const controller = factory.createController();
  const profile = factory.createProfile();
  // Todas las piezas son de la misma familia: siempre compatibles
  return lamp.brand + ' vía ' + controller.protocol + ', pico ' + profile.peak + '%';
}

console.log(setupLighting(abyssLightFactory));
console.log(setupLighting(lagoonLightFactory));`,
  },
  related: ['factory-method', 'builder', 'bridge'],
};
