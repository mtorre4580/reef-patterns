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
      en: 'Caching an expensive API call',
      es: 'Cachear una llamada cara a la API',
      'pt-BR': 'Cache de uma chamada cara à API',
    },
    scenario: {
      en: 'Exchange rates come from a paid API that charges per request. If a currency was already fetched, the app must reuse it instead of calling again.',
      es: 'Las cotizaciones vienen de una API paga que cobra por request. Si una moneda ya se consultó, la app tiene que reutilizarla en vez de volver a llamar.',
      'pt-BR':
        'As cotações vêm de uma API paga que cobra por requisição. Se uma moeda já foi consultada, o app precisa reutilizá-la em vez de chamar de novo.',
    },
    code: `const ratesApi = {
  calls: 0,
  getRate(currency) {
    this.calls++;
    return { currency, rate: currency === 'EUR' ? 0.92 : 1 };
  },
};

function createCachedRates(api) {
  const cache = new Map();
  return {
    getRate(currency) {
      if (!cache.has(currency)) cache.set(currency, api.getRate(currency));
      return cache.get(currency);
    },
  };
}

const rates = createCachedRates(ratesApi);
rates.getRate('EUR');
rates.getRate('EUR');
rates.getRate('BRL');
console.log(ratesApi.calls); // 2: the second EUR request came from the cache

// Native Proxy variant: validates form state before it is written
const form = new Proxy({}, {
  set(target, key, value) {
    if (key === 'email' && !String(value).includes('@')) throw new TypeError('Invalid email');
    target[key] = value;
    return true;
  },
});
form.email = 'ana@example.com';`,
  },
  related: ['decorator', 'adapter', 'lazy-loading', 'flyweight'],
};
