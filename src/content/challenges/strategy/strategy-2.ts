import type { Challenge } from '../../types';

export const strategy2: Challenge = {
  id: 'strategy-2',
  patternId: 'strategy',
  title: 'Algoritmo de la computadora de buceo',
  difficulty: 'facil',
  story:
    'Las computadoras de buceo calculan el tiempo sin descompresión con distintos algoritmos. Los buzos principiantes prefieren uno conservador; los instructores, el estándar. La computadora no debería saber cuál usa.',
  instructions:
    'Implementá:\n' +
    '- `standard`: `{ name: "Estándar", noDecoLimit(depth) }` que devuelve `Math.round(1000 / depth)` minutos.\n' +
    '- `conservative`: igual que el estándar pero al 80 %: `Math.round(standard.noDecoLimit(depth) * 0.8)`.\n' +
    '- `DiveComputer` con `constructor(algorithm)`, `setAlgorithm(algorithm)` y `remaining(depth, elapsedMinutes)`, que nunca devuelve negativos.\n' +
    'Sin `if` ni `switch`: elegir el algoritmo es elegir la estrategia.',
  starterCode: `class DiveComputer {
  constructor(mode) {
    this.mode = mode;
  }

  remaining(depth, elapsedMinutes) {
    let limit = Math.round(1000 / depth);
    if (this.mode === 'conservative') limit = Math.round(limit * 0.8);
    return limit - elapsedMinutes;
  }
}
`,
  tests: [
    {
      name: 'el algoritmo estándar a 20 m',
      code: `expect(new DiveComputer(standard).remaining(20, 10)).toBe(40);`,
    },
    {
      name: 'el algoritmo conservador a 20 m',
      code: `expect(new DiveComputer(conservative).remaining(20, 10)).toBe(30);`,
    },
    {
      name: 'nunca devuelve tiempo negativo',
      code: `expect(new DiveComputer(standard).remaining(30, 60)).toBe(0);`,
    },
    {
      name: 'acepta un algoritmo nuevo',
      code: `const tables = { name: 'Tablas', noDecoLimit: () => 25 };
expect(new DiveComputer(tables).remaining(18, 5)).toBe(20);`,
    },
    {
      name: 'setAlgorithm cambia el cálculo',
      code: `const computer = new DiveComputer(standard);
computer.setAlgorithm(conservative);
expect(computer.remaining(25, 0)).toBe(32);`,
    },
  ],
  checks: [
    { rule: 'maxIfStatements', max: 0, message: 'Sin if: el algoritmo decide, no la computadora' },
    { rule: 'forbidNode', node: 'SwitchStatement', message: 'Sin switch' },
  ],
  hints: [
    'Cada algoritmo es un objeto con `noDecoLimit(depth)`.',
    '`conservative` puede reutilizar a `standard` dentro de su función.',
    'Para no devolver negativos, usá `Math.max(0, limite - transcurrido)`.',
  ],
  solution: `const standard = {
  name: 'Estándar',
  noDecoLimit: (depth) => Math.round(1000 / depth),
};

const conservative = {
  name: 'Conservador',
  noDecoLimit: (depth) => Math.round(standard.noDecoLimit(depth) * 0.8),
};

class DiveComputer {
  constructor(algorithm) {
    this.algorithm = algorithm;
  }

  setAlgorithm(algorithm) {
    this.algorithm = algorithm;
  }

  remaining(depth, elapsedMinutes) {
    return Math.max(0, this.algorithm.noDecoLimit(depth) - elapsedMinutes);
  }
}
`,
};
