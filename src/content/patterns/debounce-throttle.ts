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
      en: 'Species search and a noisy sensor',
      es: 'Buscador de especies y sensor ruidoso',
      'pt-BR': 'Busca de espécies e um sensor ruidoso',
    },
    scenario: {
      en: 'The species search only queries the database when the user stops typing. The flow sensor emits dozens of readings per second and the chart updates at most once per second.',
      es: 'El buscador de especies consulta la base solo cuando el usuario deja de tipear. El sensor de flujo emite decenas de lecturas por segundo y el gráfico se actualiza como máximo una vez por segundo.',
      'pt-BR':
        'A busca de espécies só consulta a base quando o usuário para de digitar. O sensor de fluxo emite dezenas de leituras por segundo e o gráfico se atualiza no máximo uma vez por segundo.',
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

const searchSpecies = debounce((q) => console.log('Query the database:', q), 300);
searchSpecies('a');
searchSpecies('acr');
searchSpecies('acropora'); // only this one reaches the database, 300 ms later

let fakeTime = 0;
const drawFlow = throttle((lph) => console.log('Chart:', lph, 'L/h'), 1000, () => fakeTime);
for (const reading of [3100, 3150, 3120, 3300]) {
  drawFlow(reading);
  fakeTime += 400; // readings every 400 ms: the 1st and 4th are drawn
}`,
  },
  related: ['proxy', 'decorator', 'custom-hooks'],
};
