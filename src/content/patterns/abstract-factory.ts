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
      en: 'Cloud services per environment',
      es: 'Servicios cloud por entorno',
      'pt-BR': 'Serviços de nuvem por ambiente',
    },
    scenario: {
      en: 'In production the app uses cloud storage and a managed queue; locally it uses the disk and an in-memory queue. Mixing a cloud queue with local storage breaks the upload flow.',
      es: 'En producción la app usa storage en la nube y una cola administrada; en local usa el disco y una cola en memoria. Mezclar una cola de la nube con storage local rompe el flujo de subidas.',
      'pt-BR':
        'Em produção o app usa storage na nuvem e uma fila gerenciada; localmente usa o disco e uma fila em memória. Misturar uma fila da nuvem com storage local quebra o fluxo de uploads.',
    },
    code: `const cloudFactory = {
  createStorage: () => ({ put: (key) => 's3://uploads/' + key }),
  createQueue: () => ({ send: (msg) => 'sqs: ' + msg }),
};

const localFactory = {
  createStorage: () => ({ put: (key) => './tmp/uploads/' + key }),
  createQueue: () => {
    const messages = [];
    return { send: (msg) => (messages.push(msg), 'memory: ' + messages.length) };
  },
};

function uploadAvatar(factory, userId) {
  const storage = factory.createStorage();
  const queue = factory.createQueue();
  // Both pieces come from the same family: always compatible
  const url = storage.put('avatar-' + userId + '.png');
  return [url, queue.send('resize ' + url)];
}

const env = 'development';
const factory = env === 'production' ? cloudFactory : localFactory;
console.log(uploadAvatar(factory, 42));
console.log(uploadAvatar(cloudFactory, 42));`,
  },
  related: ['factory-method', 'builder', 'bridge'],
};
