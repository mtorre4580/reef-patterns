import type { Pattern } from '../types';

export const debounceThrottle: Pattern = {
  id: 'debounce-throttle',
  rank: 37,
  name: 'Debounce & Throttle',
  nameEs: 'Antirrebote y limitación',
  category: 'frontend',
  tier: 3,
  gof: false,
  summary:
    'Controla la frecuencia de una función: debounce espera a que paren los eventos; throttle la ejecuta como máximo una vez por intervalo.',
  when: 'Cuando un evento se dispara muchísimas veces (tipeo, scroll, resize, lecturas de sensores) y procesar cada uno es caro o innecesario.',
  pros: ['Reduce drásticamente llamadas a la red y renders.', 'Mejora la fluidez percibida.'],
  cons: [
    'Agrega latencia a la respuesta.',
    'Mal configurado, se pierden eventos importantes (el último en throttle).',
  ],
  realWorld:
    'lodash.debounce y throttle, useDebounce de usehooks, requestAnimationFrame como throttle visual, buscadores con autocompletado.',
  example: {
    title: 'Buscador de especies y sensor ruidoso',
    scenario:
      'El buscador de especies consulta la base solo cuando el usuario deja de tipear. El sensor de flujo emite decenas de lecturas por segundo y el gráfico se actualiza como máximo una vez por segundo.',
    code: `function debounce(fn, waitMs) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

function throttle(fn, intervalMs, now = Date.now) {
  let last = -Infinity;
  return (...args) => {
    if (now() - last >= intervalMs) {
      last = now();
      fn(...args);
    }
  };
}

const searchSpecies = debounce((q) => console.log('Buscar en la base:', q), 300);
searchSpecies('a');
searchSpecies('acr');
searchSpecies('acropora'); // solo esta llega a la base, 300 ms después

let fakeTime = 0;
const drawFlow = throttle((lph) => console.log('Gráfico:', lph, 'L/h'), 1000, () => fakeTime);
for (const reading of [3100, 3150, 3120, 3300]) {
  drawFlow(reading);
  fakeTime += 400; // lecturas cada 400 ms: se dibujan la 1.ª y la 4.ª
}`,
  },
  related: ['proxy', 'decorator', 'custom-hooks'],
};
