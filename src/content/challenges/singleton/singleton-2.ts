import type { Challenge } from '../../types';

export const singleton2: Challenge = {
  id: 'singleton-2',
  patternId: 'singleton',
  title: {
    en: 'Configuration loaded once',
    es: 'Configuración cargada una sola vez',
    'pt-BR': 'Configuração carregada uma única vez',
  },
  difficulty: 'media',
  story: {
    en: 'The app config comes from a slow `/config.json` request. Every module calls `getConfig()` and today each call fetches it again. Also, tests need to be able to start from scratch.',
    es: 'La configuración de la app viene de un request lento a `/config.json`. Cada módulo llama a `getConfig()` y hoy cada llamada la vuelve a pedir. Además, los tests necesitan poder empezar de cero.',
    'pt-BR':
      'A configuração do app vem de uma requisição lenta a `/config.json`. Cada módulo chama `getConfig()` e hoje cada chamada a busca de novo. Além disso, os testes precisam poder começar do zero.',
  },
  instructions: {
    en: 'Keep `loadConfig()` as it is and implement:\n- `getConfig()`: the first time it calls `loadConfig()` and stores the result; later calls return the same object.\n- `resetConfig()`: discards the instance so the next call loads again.',
    es: 'Mantené `loadConfig()` tal como está e implementá:\n- `getConfig()`: la primera vez llama a `loadConfig()` y guarda el resultado; las siguientes devuelven el mismo objeto.\n- `resetConfig()`: descarta la instancia para que la próxima llamada vuelva a cargar.',
    'pt-BR':
      'Mantenha `loadConfig()` como está e implemente:\n- `getConfig()`: na primeira vez chama `loadConfig()` e guarda o resultado; as seguintes devolvem o mesmo objeto.\n- `resetConfig()`: descarta a instância para que a próxima chamada carregue de novo.',
  },
  starterCode: `let loads = 0;

// Do not modify this function: it simulates a slow request
function loadConfig() {
  loads++;
  return { apiUrl: 'https://api.example.com', featureFlags: { newCheckout: false } };
}

function getConfig() {
  return loadConfig();
}

function resetConfig() {}
`,
  tests: [
    {
      name: { en: 'loads only once', es: 'carga una sola vez', 'pt-BR': 'carrega uma única vez' },
      code: `resetConfig();
const before = loads;
const a = getConfig();
const b = getConfig();
expect(a).toBe(b);
expect(loads - before).toBe(1);`,
    },
    {
      name: {
        en: 'changes are visible from anywhere',
        es: 'los cambios se ven desde cualquier lugar',
        'pt-BR': 'as mudanças são vistas de qualquer lugar',
      },
      code: `resetConfig();
getConfig().featureFlags.newCheckout = true;
expect(getConfig().featureFlags.newCheckout).toBe(true);`,
    },
    {
      name: {
        en: 'resetConfig forces a new load',
        es: 'resetConfig fuerza una carga nueva',
        'pt-BR': 'resetConfig força uma nova carga',
      },
      code: `const first = getConfig();
resetConfig();
const second = getConfig();
expect(first === second).toBe(false);
expect(second.featureFlags.newCheckout).toBe(false);`,
    },
  ],
  hints: {
    en: [
      'A `let config = null` variable in module scope holds the instance.',
      '`getConfig` can use `config ??= loadConfig()`.',
      '`resetConfig` just sets `config = null` again.',
    ],
    es: [
      'Una variable `let config = null` en el ámbito del módulo guarda la instancia.',
      '`getConfig` puede usar `config ??= loadConfig()`.',
      '`resetConfig` solo vuelve a poner `config = null`.',
    ],
    'pt-BR': [
      'Uma variável `let config = null` no escopo do módulo guarda a instância.',
      '`getConfig` pode usar `config ??= loadConfig()`.',
      '`resetConfig` só volta a fazer `config = null`.',
    ],
  },
  solution: `let loads = 0;

// Do not modify this function: it simulates a slow request
function loadConfig() {
  loads++;
  return { apiUrl: 'https://api.example.com', featureFlags: { newCheckout: false } };
}

let config = null;

function getConfig() {
  config ??= loadConfig();
  return config;
}

function resetConfig() {
  config = null;
}
`,
};
