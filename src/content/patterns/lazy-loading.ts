import type { Pattern } from '../types';

export const lazyLoading: Pattern = {
  id: 'lazy-loading',
  rank: 39,
  name: 'Lazy Loading',
  localName: { en: 'Lazy Loading', es: 'Carga diferida', 'pt-BR': 'Carregamento tardio' },
  category: 'frontend',
  tier: 3,
  gof: false,
  summary: {
    en: 'Defers loading or creating something expensive until the moment it is actually needed.',
    es: 'Posterga la carga o creación de algo costoso hasta el momento en que realmente se necesita.',
    'pt-BR':
      'Adia o carregamento ou a criação de algo custoso até o momento em que realmente é necessário.',
  },
  when: {
    en: 'When part of the app (a route, an editor, a heavy library, an image) is not always used and loading it upfront slows down startup.',
    es: 'Cuando una parte de la app (una ruta, un editor, una librería pesada, una imagen) no se usa siempre y cargarla de entrada demora el arranque.',
    'pt-BR':
      'Quando uma parte do app (uma rota, um editor, uma biblioteca pesada, uma imagem) não é sempre usada e carregá-la de saída atrasa a inicialização.',
  },
  pros: {
    en: ['Faster startup and fewer initial bytes.', 'You do not pay for what you do not use.'],
    es: ['Arranque más rápido y menos bytes iniciales.', 'No se paga por lo que no se usa.'],
    'pt-BR': [
      'Inicialização mais rápida e menos bytes iniciais.',
      'Não se paga pelo que não se usa.',
    ],
  },
  cons: {
    en: [
      'Latency on first use: a loading state is needed.',
      'Too many tiny chunks make total loading worse.',
    ],
    es: [
      'Latencia en el primer uso: hay que mostrar un estado de carga.',
      'Demasiados fragmentos pequeños empeoran la carga total.',
    ],
    'pt-BR': [
      'Latência no primeiro uso: é preciso mostrar um estado de carregamento.',
      'Fragmentos pequenos demais pioram o carregamento total.',
    ],
  },
  realWorld: {
    en: 'React.lazy with Suspense, dynamic import(), loading="lazy" on images, route-level code splitting in Vite and Next.js.',
    es: 'React.lazy con Suspense, import() dinámico, loading="lazy" en imágenes, el code splitting por ruta de Vite y Next.js.',
    'pt-BR':
      'React.lazy com Suspense, import() dinâmico, loading="lazy" em imagens, o code splitting por rota do Vite e do Next.js.',
  },
  example: {
    title: {
      en: 'Chemistry simulator loaded on demand',
      es: 'Simulador de química cargado a demanda',
      'pt-BR': 'Simulador de química carregado sob demanda',
    },
    scenario: {
      en: 'The water chemistry simulator is heavy and only used by whoever opens the advanced calculator. It is loaded the first time and reused afterwards.',
      es: 'El simulador de química del agua pesa mucho y solo lo usa quien abre la calculadora avanzada. Se carga la primera vez y se reutiliza después.',
      'pt-BR':
        'O simulador de química da água é pesado e só é usado por quem abre a calculadora avançada. Ele é carregado na primeira vez e reutilizado depois.',
    },
    code: `function lazy(loader) {
  let promise = null;
  // Memoize the promise: even if requested many times, it loads once
  return () => (promise ??= loader());
}

let loads = 0;
const loadChemistry = lazy(async () => {
  loads++;
  // In the real app: return import('./chemistry-simulator.js');
  return {
    saturationIndex: (ca, alk, ph) => +(ph - (9.3 + Math.log10(1 / (ca * alk)))).toFixed(2),
  };
});

async function openAdvancedCalculator() {
  const chemistry = await loadChemistry();
  return chemistry.saturationIndex(420, 2.9, 8.2);
}

console.log('App ready without the simulator. Loads:', loads); // 0
openAdvancedCalculator()
  .then(() => openAdvancedCalculator())
  .then((index) => console.log('Index:', index, 'Loads:', loads)); // 1`,
  },
  related: ['proxy', 'singleton', 'flyweight'],
};
