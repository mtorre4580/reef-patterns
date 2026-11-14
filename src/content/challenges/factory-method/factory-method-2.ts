import type { Challenge } from '../../types';

export const factoryMethod2: Challenge = {
  id: 'factory-method-2',
  patternId: 'factory-method',
  title: 'Mezclas de gas',
  difficulty: 'media',
  story:
    'El planificador recibe el gas como texto: "air", "nitrox32", "trimix-18-45". Cada pantalla parseaba el nombre a su manera y una calculaba mal la profundidad máxima operativa (MOD).',
  instructions:
    'Implementá `createGasMix(name)`, que devuelve `{ name, o2, he, n2, mod() }` (fracciones entre 0 y 1):\n' +
    '- `"air"`: 21 % de O₂.\n' +
    '- `"nitroxNN"`: NN % de O₂ (por ejemplo `"nitrox32"`).\n' +
    '- `"trimix-OO-HH"`: OO % de O₂ y HH % de helio.\n' +
    '- `n2` es `+(1 - o2 - he).toFixed(2)` y `mod()` es `Math.floor((1.4 / o2 - 1) * 10)` metros.\n' +
    '- Cualquier otro nombre lanza `Error("Gas desconocido: <name>")`.',
  starterCode: `function createGasMix(name) {
  return { name, o2: 0.21, he: 0, n2: 0.79, mod: () => 56 };
}
`,
  tests: [
    {
      name: 'aire',
      code: `const air = createGasMix('air');
expect([air.o2, air.he, air.n2]).toEqual([0.21, 0, 0.79]);
expect(air.mod()).toBe(56);`,
    },
    {
      name: 'nitrox con cualquier porcentaje',
      code: `expect(createGasMix('nitrox32').mod()).toBe(33);
expect(createGasMix('nitrox36').o2).toBe(0.36);
expect(createGasMix('nitrox36').mod()).toBe(28);`,
    },
    {
      name: 'trimix con helio',
      code: `const mix = createGasMix('trimix-18-45');
expect(mix.he).toBe(0.45);
expect(mix.n2).toBe(0.37);
expect(mix.mod()).toBe(67);`,
    },
    {
      name: 'un nombre inválido lanza un error',
      code: `expect(() => createGasMix('heliox')).toThrow('Gas desconocido: heliox');`,
    },
  ],
  hints: [
    'Separá la creación del objeto final en una función `mix(name, o2, he)` que calcule `n2` y `mod`.',
    'Una lista de “reconocedores” `{ match: /regex/, create: (m) => … }` evita un if por formato.',
    'Para `nitrox32`, `/^nitrox(\\d{2})$/` captura el porcentaje; dividilo por 100.',
  ],
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
  throw new Error('Gas desconocido: ' + name);
}
`,
};
