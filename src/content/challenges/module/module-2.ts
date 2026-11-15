import type { Challenge } from '../../types';

export const module2: Challenge = {
  id: 'module-2',
  patternId: 'module',
  title: {
    en: 'API quota per customer',
    es: 'Cuota de API por cliente',
    'pt-BR': 'Cota de API por cliente',
  },
  difficulty: 'media',
  story: {
    en: 'Each customer has a monthly API quota. With a class of public fields, a bug in the admin panel reset `used` to zero and a customer went way over their plan.',
    es: 'Cada cliente tiene una cuota mensual de API. Con una clase de campos públicos, un bug en el panel de admin puso `used` en cero y un cliente se pasó muchísimo de su plan.',
    'pt-BR':
      'Cada cliente tem uma cota mensal de API. Com uma classe de campos públicos, um bug no painel de admin zerou `used` e um cliente passou muito do seu plano.',
  },
  instructions: {
    en: 'Implement `createQuota(limit)`, which returns `{ consume(n), used(), remaining() }`:\n- `consume(n)` adds to the usage; if it would go over the limit, it throws `Error("Quota exceeded")` and adds nothing.\n- The usage must not be modifiable from outside.\n- Each quota is independent.',
    es: 'Implementá `createQuota(limit)`, que devuelve `{ consume(n), used(), remaining() }`:\n- `consume(n)` suma al uso; si se pasaría del límite, lanza `Error("Quota exceeded")` y no suma nada.\n- El uso no debe poder modificarse desde afuera.\n- Cada cuota es independiente.',
    'pt-BR':
      'Implemente `createQuota(limit)`, que devolve `{ consume(n), used(), remaining() }`:\n- `consume(n)` soma ao uso; se passaria do limite, lança `Error("Quota exceeded")` e não soma nada.\n- O uso não pode ser modificado de fora.\n- Cada cota é independente.',
  },
  starterCode: `class Quota {
  constructor(limit) {
    this.limit = limit;
    this.usedCount = 0;
  }
  consume(n) {
    this.usedCount += n;
  }
  used() {
    return this.usedCount;
  }
  remaining() {
    return this.limit - this.usedCount;
  }
}

function createQuota(limit) {
  return new Quota(limit);
}
`,
  tests: [
    {
      name: { en: 'accumulates usage', es: 'acumula el uso', 'pt-BR': 'acumula o uso' },
      code: `const quota = createQuota(1000);
quota.consume(200);
quota.consume(150);
expect(quota.used()).toBe(350);
expect(quota.remaining()).toBe(650);`,
    },
    {
      name: {
        en: 'does not allow going over the limit',
        es: 'no permite pasarse del límite',
        'pt-BR': 'não permite passar do limite',
      },
      code: `const quota = createQuota(100);
quota.consume(90);
expect(() => quota.consume(20)).toThrow('Quota exceeded');
expect(quota.used()).toBe(90);`,
    },
    {
      name: {
        en: 'usage cannot be touched from outside',
        es: 'el uso no se puede tocar desde afuera',
        'pt-BR': 'o uso não pode ser mexido de fora',
      },
      code: `const quota = createQuota(100);
quota.consume(80);
try {
  quota.usedCount = 0;
  quota.used = () => 0;
} catch {
  // in strict mode, writing to a frozen object throws: that is fine too
}
expect(() => quota.consume(30)).toThrow('Quota exceeded');`,
    },
    {
      name: {
        en: 'each quota is independent',
        es: 'cada cuota es independiente',
        'pt-BR': 'cada cota é independente',
      },
      code: `const acme = createQuota(500);
const globex = createQuota(500);
acme.consume(400);
expect(globex.remaining()).toBe(500);`,
    },
  ],
  hints: {
    en: [
      'Keep the usage in a local variable of `createQuota`.',
      "Use that variable (not `this`) inside `consume`, and freeze the object you return so its functions can't be overwritten.",
    ],
    es: [
      'Guardá el uso en una variable local de `createQuota`.',
      'Usá esa variable (no `this`) dentro de `consume`, y congelá el objeto que devolvés para que no se puedan pisar sus funciones.',
    ],
    'pt-BR': [
      'Guarde o uso em uma variável local de `createQuota`.',
      'Use essa variável (não `this`) dentro de `consume` e congele o objeto que devolve para que suas funções não possam ser sobrescritas.',
    ],
  },
  solution: `function createQuota(limit) {
  let usedCount = 0;

  return Object.freeze({
    consume(n) {
      if (usedCount + n > limit) throw new Error('Quota exceeded');
      usedCount += n;
    },
    used: () => usedCount,
    remaining: () => limit - usedCount,
  });
}
`,
};
