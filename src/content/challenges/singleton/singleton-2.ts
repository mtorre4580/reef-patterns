import type { Challenge } from '../../types';

export const singleton2: Challenge = {
  id: 'singleton-2',
  patternId: 'singleton',
  title: {
    en: 'Preferences loaded once',
    es: 'Preferencias cargadas una sola vez',
    'pt-BR': 'Preferências carregadas uma única vez',
  },
  difficulty: 'media',
  story: {
    en: 'Unit preferences are read from a slow file. Every screen calls `getSettings()` and today each call reads it again. Also, tests need to be able to start from scratch.',
    es: 'Las preferencias de unidades se leen de un archivo lento. Cada pantalla llama a `getSettings()` y hoy cada llamada vuelve a leerlo. Además, los tests necesitan poder empezar de cero.',
    'pt-BR':
      'As preferências de unidades são lidas de um arquivo lento. Cada tela chama `getSettings()` e hoje cada chamada volta a lê-lo. Além disso, os testes precisam poder começar do zero.',
  },
  instructions: {
    en: 'Keep `loadDefaults()` as it is and implement:\n- `getSettings()`: the first time it calls `loadDefaults()` and stores the result; later calls return the same object.\n- `resetSettings()`: discards the instance so the next call loads again.',
    es: 'Mantené `loadDefaults()` tal como está e implementá:\n- `getSettings()`: la primera vez llama a `loadDefaults()` y guarda el resultado; las siguientes devuelven el mismo objeto.\n- `resetSettings()`: descarta la instancia para que la próxima llamada vuelva a cargar.',
    'pt-BR':
      'Mantenha `loadDefaults()` como está e implemente:\n- `getSettings()`: na primeira vez chama `loadDefaults()` e guarda o resultado; as seguintes devolvem o mesmo objeto.\n- `resetSettings()`: descarta a instância para que a próxima chamada carregue de novo.',
  },
  starterCode: `let loads = 0;

// Do not modify this function: it simulates a slow read
function loadDefaults() {
  loads++;
  return { temperatureUnit: 'C', salinityUnit: 'ppt' };
}

function getSettings() {
  return loadDefaults();
}

function resetSettings() {}
`,
  tests: [
    {
      name: { en: 'loads only once', es: 'carga una sola vez', 'pt-BR': 'carrega uma única vez' },
      code: `resetSettings();
const before = loads;
const a = getSettings();
const b = getSettings();
expect(a).toBe(b);
expect(loads - before).toBe(1);`,
    },
    {
      name: {
        en: 'changes are visible from anywhere',
        es: 'los cambios se ven desde cualquier lugar',
        'pt-BR': 'as mudanças são vistas de qualquer lugar',
      },
      code: `resetSettings();
getSettings().temperatureUnit = 'F';
expect(getSettings().temperatureUnit).toBe('F');`,
    },
    {
      name: {
        en: 'resetSettings forces a new load',
        es: 'resetSettings fuerza una carga nueva',
        'pt-BR': 'resetSettings força uma nova carga',
      },
      code: `const first = getSettings();
resetSettings();
const second = getSettings();
expect(first === second).toBe(false);
expect(second.temperatureUnit).toBe('C');`,
    },
  ],
  hints: {
    en: [
      'A `let settings = null` variable in module scope holds the instance.',
      '`getSettings` can use `settings ??= loadDefaults()`.',
      '`resetSettings` just sets `settings = null` again.',
    ],
    es: [
      'Una variable `let settings = null` en el ámbito del módulo guarda la instancia.',
      '`getSettings` puede usar `settings ??= loadDefaults()`.',
      '`resetSettings` solo vuelve a poner `settings = null`.',
    ],
    'pt-BR': [
      'Uma variável `let settings = null` no escopo do módulo guarda a instância.',
      '`getSettings` pode usar `settings ??= loadDefaults()`.',
      '`resetSettings` só volta a fazer `settings = null`.',
    ],
  },
  solution: `let loads = 0;

// Do not modify this function: it simulates a slow read
function loadDefaults() {
  loads++;
  return { temperatureUnit: 'C', salinityUnit: 'ppt' };
}

let settings = null;

function getSettings() {
  settings ??= loadDefaults();
  return settings;
}

function resetSettings() {
  settings = null;
}
`,
};
