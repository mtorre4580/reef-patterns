import type { Challenge } from '../../types';

export const singleton2: Challenge = {
  id: 'singleton-2',
  patternId: 'singleton',
  title: 'Preferencias cargadas una sola vez',
  difficulty: 'media',
  story:
    'Las preferencias de unidades se leen de un archivo lento. Cada pantalla llama a `getSettings()` y hoy cada llamada vuelve a leerlo. Además, los tests necesitan poder empezar de cero.',
  instructions:
    'Mantené `loadDefaults()` tal como está e implementá:\n' +
    '- `getSettings()`: la primera vez llama a `loadDefaults()` y guarda el resultado; las siguientes devuelven el mismo objeto.\n' +
    '- `resetSettings()`: descarta la instancia para que la próxima llamada vuelva a cargar.',
  starterCode: `let loads = 0;

// No modifiques esta función: simula una lectura lenta
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
      name: 'carga una sola vez',
      code: `resetSettings();
const before = loads;
const a = getSettings();
const b = getSettings();
expect(a).toBe(b);
expect(loads - before).toBe(1);`,
    },
    {
      name: 'los cambios se ven desde cualquier lugar',
      code: `resetSettings();
getSettings().temperatureUnit = 'F';
expect(getSettings().temperatureUnit).toBe('F');`,
    },
    {
      name: 'resetSettings fuerza una carga nueva',
      code: `const first = getSettings();
resetSettings();
const second = getSettings();
expect(first === second).toBe(false);
expect(second.temperatureUnit).toBe('C');`,
    },
  ],
  hints: [
    'Una variable `let settings = null` en el ámbito del módulo guarda la instancia.',
    '`getSettings` puede usar `settings ??= loadDefaults()`.',
    '`resetSettings` solo vuelve a poner `settings = null`.',
  ],
  solution: `let loads = 0;

// No modifiques esta función: simula una lectura lenta
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
