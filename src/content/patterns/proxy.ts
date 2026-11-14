import type { Pattern } from '../types';

export const proxy: Pattern = {
  id: 'proxy',
  rank: 14,
  name: 'Proxy',
  nameEs: 'Apoderado',
  category: 'estructural',
  tier: 2,
  gof: true,
  summary:
    'Un sustituto con la misma interfaz que el objeto real controla el acceso a él: caché, permisos, carga diferida o validación.',
  when: 'Cuando querés interceptar el acceso a un objeto caro, remoto o sensible sin que el cliente note la diferencia.',
  pros: [
    'Agrega caché, control de acceso o logging sin tocar el objeto real.',
    'Transparente para el cliente.',
  ],
  cons: [
    'Puede ocultar latencia o efectos inesperados.',
    'Con el Proxy nativo de JS, el código se vuelve más difícil de leer y depurar.',
  ],
  realWorld:
    'El objeto Proxy de ES2015, la reactividad de Vue 3 y MobX, Immer, los proxies de desarrollo de Vite.',
  example: {
    title: 'Caché de un análisis ICP',
    scenario:
      'Un análisis ICP del agua tarda días y cuesta dinero. Si ya hay un resultado de esa muestra, la app debe devolverlo sin pedirlo de nuevo al laboratorio.',
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
cachedLab.analyze('muestra-0315');
cachedLab.analyze('muestra-0315');
cachedLab.analyze('muestra-0402');
console.log(lab.calls); // 2: la segunda consulta salió de la caché

// Variante con Proxy nativo: valida que nadie escriba un pH imposible
const params = new Proxy({}, {
  set(target, key, value) {
    if (key === 'ph' && (value < 0 || value > 14)) throw new RangeError('pH inválido');
    target[key] = value;
    return true;
  },
});
params.ph = 8.2;`,
  },
  related: ['decorator', 'adapter', 'lazy-loading', 'flyweight'],
};
