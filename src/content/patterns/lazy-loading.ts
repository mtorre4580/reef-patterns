import type { Pattern } from '../types';

export const lazyLoading: Pattern = {
  id: 'lazy-loading',
  rank: 39,
  name: 'Lazy Loading',
  nameEs: 'Carga diferida',
  category: 'frontend',
  tier: 3,
  gof: false,
  summary:
    'Posterga la carga o creación de algo costoso hasta el momento en que realmente se necesita.',
  when: 'Cuando una parte de la app (una ruta, un editor, una librería pesada, una imagen) no se usa siempre y cargarla de entrada demora el arranque.',
  pros: ['Arranque más rápido y menos bytes iniciales.', 'No se paga por lo que no se usa.'],
  cons: [
    'Latencia en el primer uso: hay que mostrar un estado de carga.',
    'Demasiados fragmentos pequeños empeoran la carga total.',
  ],
  realWorld:
    'React.lazy con Suspense, import() dinámico, loading="lazy" en imágenes, el code splitting por ruta de Vite y Next.js.',
  example: {
    title: 'Simulador de química cargado a demanda',
    scenario:
      'El simulador de química del agua pesa mucho y solo lo usa quien abre la calculadora avanzada. Se carga la primera vez y se reutiliza después.',
    code: `function lazy(loader) {
  let promise = null;
  // Memoriza la promesa: aunque se pida varias veces, carga una sola
  return () => (promise ??= loader());
}

let loads = 0;
const loadChemistry = lazy(async () => {
  loads++;
  // En la app real: return import('./chemistry-simulator.js');
  return {
    saturationIndex: (ca, alk, ph) => +(ph - (9.3 + Math.log10(1 / (ca * alk)))).toFixed(2),
  };
});

async function openAdvancedCalculator() {
  const chemistry = await loadChemistry();
  return chemistry.saturationIndex(420, 2.9, 8.2);
}

console.log('App lista sin el simulador. Cargas:', loads); // 0
openAdvancedCalculator()
  .then(() => openAdvancedCalculator())
  .then((index) => console.log('Índice:', index, 'Cargas:', loads)); // 1`,
  },
  related: ['proxy', 'singleton', 'flyweight'],
};
