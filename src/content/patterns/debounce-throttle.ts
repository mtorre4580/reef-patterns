import type { Pattern } from '../types';

export const debounceThrottle: Pattern = {
  id: 'debounce-throttle',
  rank: 37,
  name: 'Debounce & Throttle',
  localName: {
    en: 'Debounce & Throttle',
    es: 'Antirrebote y limitación',
    'pt-BR': 'Debounce e throttle',
  },
  category: 'frontend',
  tier: 3,
  gof: false,
  summary: {
    en: 'Controls how often a function runs: debounce waits until events stop; throttle runs it at most once per interval.',
    es: 'Controla la frecuencia de una función: debounce espera a que paren los eventos; throttle la ejecuta como máximo una vez por intervalo.',
    'pt-BR':
      'Controla a frequência de uma função: o debounce espera os eventos pararem; o throttle a executa no máximo uma vez por intervalo.',
  },
  when: {
    en: 'When an event fires a huge number of times (typing, scroll, resize, sensor readings) and handling each one is expensive or pointless.',
    es: 'Cuando un evento se dispara muchísimas veces (tipeo, scroll, resize, lecturas de sensores) y procesar cada uno es caro o innecesario.',
    'pt-BR':
      'Quando um evento dispara muitíssimas vezes (digitação, scroll, resize, leituras de sensores) e processar cada um é caro ou desnecessário.',
  },
  pros: {
    en: ['Drastically cuts network calls and renders.', 'Improves perceived smoothness.'],
    es: ['Reduce drásticamente llamadas a la red y renders.', 'Mejora la fluidez percibida.'],
    'pt-BR': ['Reduz drasticamente chamadas à rede e renders.', 'Melhora a fluidez percebida.'],
  },
  cons: {
    en: [
      'Adds latency to the response.',
      'Misconfigured, it drops important events (the last one with throttle).',
    ],
    es: [
      'Agrega latencia a la respuesta.',
      'Mal configurado, se pierden eventos importantes (el último en throttle).',
    ],
    'pt-BR': [
      'Adiciona latência à resposta.',
      'Mal configurado, perde eventos importantes (o último no throttle).',
    ],
  },
  realWorld: {
    en: "lodash's debounce and throttle, usehooks' useDebounce, requestAnimationFrame as visual throttling, autocomplete search boxes.",
    es: 'lodash.debounce y throttle, useDebounce de usehooks, requestAnimationFrame como throttle visual, buscadores con autocompletado.',
    'pt-BR':
      'lodash.debounce e throttle, o useDebounce do usehooks, requestAnimationFrame como throttle visual, buscas com autocompletar.',
  },
  example: {
    title: {
      en: 'Search as you type and scroll tracking',
      es: 'Búsqueda mientras escribís y tracking de scroll',
      'pt-BR': 'Busca enquanto digita e tracking de scroll',
    },
    scenario: {
      en: 'The search box only queries the API when the user stops typing. Scroll depth analytics are sent at most once per second, not on every scroll event.',
      es: 'El buscador solo consulta la API cuando el usuario deja de escribir. El tracking de profundidad de scroll se manda como máximo una vez por segundo, no en cada evento.',
      'pt-BR':
        'A busca só consulta a API quando o usuário para de digitar. O tracking de profundidade de scroll é enviado no máximo uma vez por segundo, não a cada evento.',
    },
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

const searchProducts = debounce((q) => console.log('GET /search?q=' + q), 300);
searchProducts('s');
searchProducts('sne');
searchProducts('sneakers'); // only this one reaches the API, 300 ms later

let fakeTime = 0;
const trackScroll = throttle((pct) => console.log('track scroll_depth', pct + '%'), 1000, () => fakeTime);
for (const pct of [10, 25, 40, 70]) {
  trackScroll(pct);
  fakeTime += 400; // events every 400 ms: only the 1st and 4th are sent
}`,
  },
  related: ['proxy', 'decorator', 'custom-hooks'],
};
