import type { Challenge } from '../../types';

export const factoryMethod2: Challenge = {
  id: 'factory-method-2',
  patternId: 'factory-method',
  title: { en: 'Gas mixes', es: 'Mezclas de gas', 'pt-BR': 'Misturas de gás' },
  difficulty: 'media',
  story: {
    en: 'The planner receives the gas as text: "air", "nitrox32", "trimix-18-45". Every screen parsed the name its own way and one of them computed the maximum operating depth (MOD) wrong.',
    es: 'El planificador recibe el gas como texto: "air", "nitrox32", "trimix-18-45". Cada pantalla parseaba el nombre a su manera y una calculaba mal la profundidad máxima operativa (MOD).',
    'pt-BR':
      'O planejador recebe o gás como texto: "air", "nitrox32", "trimix-18-45". Cada tela interpretava o nome do seu jeito e uma calculava errado a profundidade máxima operacional (MOD).',
  },
  instructions: {
    en: 'Implement `createGasMix(name)`, which returns `{ name, o2, he, n2, mod() }` (fractions between 0 and 1):\n- `"air"`: 21 % O₂.\n- `"nitroxNN"`: NN % O₂ (for example `"nitrox32"`).\n- `"trimix-OO-HH"`: OO % O₂ and HH % helium.\n- `n2` is `+(1 - o2 - he).toFixed(2)` and `mod()` is `Math.floor((1.4 / o2 - 1) * 10)` meters.\n- Any other name throws `Error("Unknown gas: <name>")`.',
    es: 'Implementá `createGasMix(name)`, que devuelve `{ name, o2, he, n2, mod() }` (fracciones entre 0 y 1):\n- `"air"`: 21 % de O₂.\n- `"nitroxNN"`: NN % de O₂ (por ejemplo `"nitrox32"`).\n- `"trimix-OO-HH"`: OO % de O₂ y HH % de helio.\n- `n2` es `+(1 - o2 - he).toFixed(2)` y `mod()` es `Math.floor((1.4 / o2 - 1) * 10)` metros.\n- Cualquier otro nombre lanza `Error("Unknown gas: <name>")`.',
    'pt-BR':
      'Implemente `createGasMix(name)`, que devolve `{ name, o2, he, n2, mod() }` (frações entre 0 e 1):\n- `"air"`: 21 % de O₂.\n- `"nitroxNN"`: NN % de O₂ (por exemplo `"nitrox32"`).\n- `"trimix-OO-HH"`: OO % de O₂ e HH % de hélio.\n- `n2` é `+(1 - o2 - he).toFixed(2)` e `mod()` é `Math.floor((1.4 / o2 - 1) * 10)` metros.\n- Qualquer outro nome lança `Error("Unknown gas: <name>")`.',
  },
  starterCode: `function createGasMix(name) {
  return { name, o2: 0.21, he: 0, n2: 0.79, mod: () => 56 };
}
`,
  tests: [
    {
      name: { en: 'air', es: 'aire', 'pt-BR': 'ar' },
      code: `const air = createGasMix('air');
expect([air.o2, air.he, air.n2]).toEqual([0.21, 0, 0.79]);
expect(air.mod()).toBe(56);`,
    },
    {
      name: {
        en: 'nitrox with any percentage',
        es: 'nitrox con cualquier porcentaje',
        'pt-BR': 'nitrox com qualquer porcentagem',
      },
      code: `expect(createGasMix('nitrox32').mod()).toBe(33);
expect(createGasMix('nitrox36').o2).toBe(0.36);
expect(createGasMix('nitrox36').mod()).toBe(28);`,
    },
    {
      name: { en: 'trimix with helium', es: 'trimix con helio', 'pt-BR': 'trimix com hélio' },
      code: `const mix = createGasMix('trimix-18-45');
expect(mix.he).toBe(0.45);
expect(mix.n2).toBe(0.37);
expect(mix.mod()).toBe(67);`,
    },
    {
      name: {
        en: 'an invalid name throws an error',
        es: 'un nombre inválido lanza un error',
        'pt-BR': 'um nome inválido lança um erro',
      },
      code: `expect(() => createGasMix('heliox')).toThrow('Unknown gas: heliox');`,
    },
  ],
  hints: {
    en: [
      'Move building the final object into a `mix(name, o2, he)` function that computes `n2` and `mod`.',
      'A list of "recognizers" `{ match: /regex/, create: (m) => … }` avoids one if per format.',
      'For `nitrox32`, `/^nitrox(\\d{2})$/` captures the percentage; divide it by 100.',
    ],
    es: [
      'Separá la creación del objeto final en una función `mix(name, o2, he)` que calcule `n2` y `mod`.',
      'Una lista de “reconocedores” `{ match: /regex/, create: (m) => … }` evita un if por formato.',
      'Para `nitrox32`, `/^nitrox(\\d{2})$/` captura el porcentaje; dividilo por 100.',
    ],
    'pt-BR': [
      'Separe a criação do objeto final em uma função `mix(name, o2, he)` que calcule `n2` e `mod`.',
      'Uma lista de "reconhecedores" `{ match: /regex/, create: (m) => … }` evita um if por formato.',
      'Para `nitrox32`, `/^nitrox(\\d{2})$/` captura a porcentagem; divida por 100.',
    ],
  },
  solution: `function mix(name, o2, he = 0) {
  return {
    name,
    o2,
    he,
    n2: +(1 - o2 - he).toFixed(2),
    mod: () => Math.floor((1.4 / o2 - 1) * 10),
  };
}

const recognizers = [
  { match: /^air$/, create: (m) => mix(m[0], 0.21) },
  { match: /^nitrox(\\d{2})$/, create: (m) => mix(m[0], Number(m[1]) / 100) },
  { match: /^trimix-(\\d{2})-(\\d{2})$/, create: (m) => mix(m[0], Number(m[1]) / 100, Number(m[2]) / 100) },
];

function createGasMix(name) {
  for (const { match, create } of recognizers) {
    const m = name.match(match);
    if (m) return create(m);
  }
  throw new Error('Unknown gas: ' + name);
}
`,
};
