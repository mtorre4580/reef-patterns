import type { Pattern } from '../types';

export const proxy: Pattern = {
  id: 'proxy',
  rank: 14,
  name: 'Proxy',
  localName: { en: 'Proxy', es: 'Apoderado', 'pt-BR': 'Procurador' },
  category: 'estructural',
  tier: 2,
  gof: true,
  summary: {
    en: 'A stand-in with the same interface as the real object controls access to it: caching, permissions, lazy loading or validation.',
    es: 'Un sustituto con la misma interfaz que el objeto real controla el acceso a él: caché, permisos, carga diferida o validación.',
    'pt-BR':
      'Um substituto com a mesma interface do objeto real controla o acesso a ele: cache, permissões, carregamento tardio ou validação.',
  },
  when: {
    en: 'When you want to intercept access to an expensive, remote or sensitive object without the client noticing.',
    es: 'Cuando querés interceptar el acceso a un objeto caro, remoto o sensible sin que el cliente note la diferencia.',
    'pt-BR':
      'Quando você quer interceptar o acesso a um objeto caro, remoto ou sensível sem que o cliente perceba a diferença.',
  },
  pros: {
    en: [
      'Adds caching, access control or logging without touching the real object.',
      'Transparent to the client.',
    ],
    es: [
      'Agrega caché, control de acceso o logging sin tocar el objeto real.',
      'Transparente para el cliente.',
    ],
    'pt-BR': [
      'Adiciona cache, controle de acesso ou logging sem mexer no objeto real.',
      'Transparente para o cliente.',
    ],
  },
  cons: {
    en: [
      'It can hide latency or unexpected effects.',
      "With JS's native Proxy, code gets harder to read and debug.",
    ],
    es: [
      'Puede ocultar latencia o efectos inesperados.',
      'Con el Proxy nativo de JS, el código se vuelve más difícil de leer y depurar.',
    ],
    'pt-BR': [
      'Pode esconder latência ou efeitos inesperados.',
      'Com o Proxy nativo do JS, o código fica mais difícil de ler e depurar.',
    ],
  },
  realWorld: {
    en: 'The ES2015 Proxy object, Vue 3 and MobX reactivity, Immer, Vite dev proxies.',
    es: 'El objeto Proxy de ES2015, la reactividad de Vue 3 y MobX, Immer, los proxies de desarrollo de Vite.',
    'pt-BR':
      'O objeto Proxy do ES2015, a reatividade do Vue 3 e do MobX, o Immer, os proxies de desenvolvimento do Vite.',
  },
  example: {
    title: {
      en: 'Caching an ICP analysis',
      es: 'Caché de un análisis ICP',
      'pt-BR': 'Cache de uma análise ICP',
    },
    scenario: {
      en: 'An ICP water analysis takes days and costs money. If a sample already has a result, the app must return it without asking the lab again.',
      es: 'Un análisis ICP del agua tarda días y cuesta dinero. Si ya hay un resultado de esa muestra, la app debe devolverlo sin pedirlo de nuevo al laboratorio.',
      'pt-BR':
        'Uma análise ICP da água demora dias e custa dinheiro. Se já existe um resultado daquela amostra, o app deve devolvê-lo sem pedir de novo ao laboratório.',
    },
    code: `const lab = {
  calls: 0,
  analyze(sampleId) {
    this.calls++;
    return { sampleId, magnesium: 1350, strontium: 8, copper: 0 };
  },
};

function createCachedLab(realLab) {
  const cache = new Map();
  return {
    analyze(sampleId) {
      if (!cache.has(sampleId)) cache.set(sampleId, realLab.analyze(sampleId));
      return cache.get(sampleId);
    },
  };
}

const cachedLab = createCachedLab(lab);
cachedLab.analyze('sample-0315');
cachedLab.analyze('sample-0315');
cachedLab.analyze('sample-0402');
console.log(lab.calls); // 2: the second query came from the cache

// Native Proxy variant: makes sure nobody writes an impossible pH
const params = new Proxy({}, {
  set(target, key, value) {
    if (key === 'ph' && (value < 0 || value > 14)) throw new RangeError('Invalid pH');
    target[key] = value;
    return true;
  },
});
params.ph = 8.2;`,
  },
  related: ['decorator', 'adapter', 'lazy-loading', 'flyweight'],
};
