import type { Pattern } from '../types';

export const abstractFactory: Pattern = {
  id: 'abstract-factory',
  rank: 22,
  name: 'Abstract Factory',
  localName: { en: 'Abstract Factory', es: 'Fábrica abstracta', 'pt-BR': 'Fábrica abstrata' },
  category: 'creacional',
  tier: 2,
  gof: true,
  summary: {
    en: 'A factory creates families of related objects that are guaranteed to be compatible with each other.',
    es: 'Una fábrica crea familias de objetos relacionados que están garantizados de ser compatibles entre sí.',
    'pt-BR':
      'Uma fábrica cria famílias de objetos relacionados que têm garantia de serem compatíveis entre si.',
  },
  when: {
    en: 'When you need to create several objects that must match (by brand, platform or theme) and mixing families would be a bug.',
    es: 'Cuando necesitás crear varios objetos que tienen que combinar (por marca, plataforma o tema) y mezclar familias sería un error.',
    'pt-BR':
      'Quando você precisa criar vários objetos que precisam combinar (por marca, plataforma ou tema) e misturar famílias seria um erro.',
  },
  pros: {
    en: [
      'Guarantees compatibility between the products of a family.',
      'Switching families means switching a single factory.',
    ],
    es: [
      'Garantiza la compatibilidad entre los productos de una familia.',
      'Cambiar de familia es cambiar una sola fábrica.',
    ],
    'pt-BR': [
      'Garante a compatibilidade entre os produtos de uma família.',
      'Trocar de família é trocar uma única fábrica.',
    ],
  },
  cons: {
    en: [
      'Adding a new product means touching every factory.',
      'A lot of structure for few variants.',
    ],
    es: [
      'Agregar un producto nuevo obliga a tocar todas las fábricas.',
      'Mucha estructura para pocas variantes.',
    ],
    'pt-BR': [
      'Adicionar um produto novo obriga a mexer em todas as fábricas.',
      'Muita estrutura para poucas variantes.',
    ],
  },
  realWorld: {
    en: 'UI library themes that provide consistent buttons, inputs and dialogs; database drivers that create connection, query and transaction.',
    es: 'Los temas de librerías de UI que entregan botones, inputs y diálogos coherentes; los drivers de bases de datos que crean conexión, consulta y transacción.',
    'pt-BR':
      'Os temas de bibliotecas de UI que entregam botões, inputs e diálogos coerentes; os drivers de banco de dados que criam conexão, consulta e transação.',
  },
  example: {
    title: {
      en: 'Lighting kits by brand',
      es: 'Kits de iluminación por marca',
      'pt-BR': 'Kits de iluminação por marca',
    },
    scenario: {
      en: "Each brand has its own lamp, controller and sunrise profile. One brand's controller doesn't understand another's profiles, so the whole kit is built from a single factory.",
      es: 'Cada marca tiene su lámpara, su controlador y su perfil de amanecer. Un controlador de una marca no entiende los perfiles de otra, así que el kit se arma completo desde una fábrica.',
      'pt-BR':
        'Cada marca tem sua luminária, seu controlador e seu perfil de amanhecer. O controlador de uma marca não entende os perfis de outra, então o kit é montado completo a partir de uma fábrica.',
    },
    code: `const abyssLightFactory = {
  createLamp: () => ({ brand: 'Abyss', channels: ['blue', 'white', 'UV'] }),
  createController: () => ({ brand: 'Abyss', protocol: 'abyss-link' }),
  createProfile: () => ({ brand: 'Abyss', sunrise: '10:00', peak: 85 }),
};

const lagoonLightFactory = {
  createLamp: () => ({ brand: 'Lagoon', channels: ['royal', 'cool white', 'violet'] }),
  createController: () => ({ brand: 'Lagoon', protocol: 'wifi-lgn' }),
  createProfile: () => ({ brand: 'Lagoon', sunrise: '11:00', peak: 70 }),
};

function setupLighting(factory) {
  const lamp = factory.createLamp();
  const controller = factory.createController();
  const profile = factory.createProfile();
  // Every piece comes from the same family: always compatible
  return lamp.brand + ' via ' + controller.protocol + ', peak ' + profile.peak + '%';
}

console.log(setupLighting(abyssLightFactory));
console.log(setupLighting(lagoonLightFactory));`,
  },
  related: ['factory-method', 'builder', 'bridge'],
};
