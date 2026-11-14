import type { Challenge } from '../../types';

export const strategy2: Challenge = {
  id: 'strategy-2',
  patternId: 'strategy',
  title: {
    en: "The dive computer's algorithm",
    es: 'Algoritmo de la computadora de buceo',
    'pt-BR': 'Algoritmo do computador de mergulho',
  },
  difficulty: 'facil',
  story: {
    en: 'Dive computers compute no-decompression time with different algorithms. Beginners prefer a conservative one; instructors, the standard one. The computer should not know which one it uses.',
    es: 'Las computadoras de buceo calculan el tiempo sin descompresión con distintos algoritmos. Los buzos principiantes prefieren uno conservador; los instructores, el estándar. La computadora no debería saber cuál usa.',
    'pt-BR':
      'Os computadores de mergulho calculam o tempo sem descompressão com algoritmos diferentes. Os iniciantes preferem um conservador; os instrutores, o padrão. O computador não deveria saber qual usa.',
  },
  instructions: {
    en: 'Implement:\n- `standard`: `{ name: "Standard", noDecoLimit(depth) }`, which returns `Math.round(1000 / depth)` minutes.\n- `conservative`: like the standard one but at 80 %: `Math.round(standard.noDecoLimit(depth) * 0.8)`.\n- `DiveComputer` with `constructor(algorithm)`, `setAlgorithm(algorithm)` and `remaining(depth, elapsedMinutes)`, which never returns negatives.\nNo `if` and no `switch`: picking the algorithm means picking the strategy.',
    es: 'Implementá:\n- `standard`: `{ name: "Standard", noDecoLimit(depth) }` que devuelve `Math.round(1000 / depth)` minutos.\n- `conservative`: igual que el estándar pero al 80 %: `Math.round(standard.noDecoLimit(depth) * 0.8)`.\n- `DiveComputer` con `constructor(algorithm)`, `setAlgorithm(algorithm)` y `remaining(depth, elapsedMinutes)`, que nunca devuelve negativos.\nSin `if` ni `switch`: elegir el algoritmo es elegir la estrategia.',
    'pt-BR':
      'Implemente:\n- `standard`: `{ name: "Standard", noDecoLimit(depth) }`, que devolve `Math.round(1000 / depth)` minutos.\n- `conservative`: igual ao padrão, mas a 80 %: `Math.round(standard.noDecoLimit(depth) * 0.8)`.\n- `DiveComputer` com `constructor(algorithm)`, `setAlgorithm(algorithm)` e `remaining(depth, elapsedMinutes)`, que nunca devolve negativos.\nSem `if` nem `switch`: escolher o algoritmo é escolher a estratégia.',
  },
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
      name: {
        en: 'the standard algorithm at 20 m',
        es: 'el algoritmo estándar a 20 m',
        'pt-BR': 'o algoritmo padrão a 20 m',
      },
      code: `expect(new DiveComputer(standard).remaining(20, 10)).toBe(40);`,
    },
    {
      name: {
        en: 'the conservative algorithm at 20 m',
        es: 'el algoritmo conservador a 20 m',
        'pt-BR': 'o algoritmo conservador a 20 m',
      },
      code: `expect(new DiveComputer(conservative).remaining(20, 10)).toBe(30);`,
    },
    {
      name: {
        en: 'never returns negative time',
        es: 'nunca devuelve tiempo negativo',
        'pt-BR': 'nunca devolve tempo negativo',
      },
      code: `expect(new DiveComputer(standard).remaining(30, 60)).toBe(0);`,
    },
    {
      name: {
        en: 'accepts a new algorithm',
        es: 'acepta un algoritmo nuevo',
        'pt-BR': 'aceita um algoritmo novo',
      },
      code: `const tables = { name: 'Tables', noDecoLimit: () => 25 };
expect(new DiveComputer(tables).remaining(18, 5)).toBe(20);`,
    },
    {
      name: {
        en: 'setAlgorithm changes the calculation',
        es: 'setAlgorithm cambia el cálculo',
        'pt-BR': 'setAlgorithm muda o cálculo',
      },
      code: `const computer = new DiveComputer(standard);
computer.setAlgorithm(conservative);
expect(computer.remaining(25, 0)).toBe(32);`,
    },
  ],
  checks: [
    {
      rule: 'maxIfStatements',
      max: 0,
      message: {
        en: 'No if: the algorithm decides, not the computer',
        es: 'Sin if: el algoritmo decide, no la computadora',
        'pt-BR': 'Sem if: quem decide é o algoritmo, não o computador',
      },
    },
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: { en: 'No switch', es: 'Sin switch', 'pt-BR': 'Sem switch' },
    },
  ],
  hints: {
    en: [
      'Each algorithm is an object with `noDecoLimit(depth)`.',
      '`conservative` can reuse `standard` inside its function.',
      'To avoid negatives, use `Math.max(0, limit - elapsed)`.',
    ],
    es: [
      'Cada algoritmo es un objeto con `noDecoLimit(depth)`.',
      '`conservative` puede reutilizar a `standard` dentro de su función.',
      'Para no devolver negativos, usá `Math.max(0, limite - transcurrido)`.',
    ],
    'pt-BR': [
      'Cada algoritmo é um objeto com `noDecoLimit(depth)`.',
      '`conservative` pode reutilizar `standard` dentro da sua função.',
      'Para não devolver negativos, use `Math.max(0, limite - decorrido)`.',
    ],
  },
  solution: `const standard = {
  name: 'Standard',
  noDecoLimit: (depth) => Math.round(1000 / depth),
};

const conservative = {
  name: 'Conservative',
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
