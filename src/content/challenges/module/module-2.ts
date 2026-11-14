import type { Challenge } from '../../types';

export const module2: Challenge = {
  id: 'module-2',
  patternId: 'module',
  title: {
    en: 'Daily dosing limit',
    es: 'Límite diario de dosificación',
    'pt-BR': 'Limite diário de dosagem',
  },
  difficulty: 'media',
  story: {
    en: 'Each doser pump has a daily safety limit. With a class of public fields, a panel bug reset the total to zero and the pump dosed twice as much.',
    es: 'Cada bomba de la dosificadora tiene un límite diario de seguridad. Con una clase de campos públicos, un bug en el panel puso el total en cero y la bomba dosificó el doble.',
    'pt-BR':
      'Cada bomba da dosadora tem um limite diário de segurança. Com uma classe de campos públicos, um bug no painel zerou o total e a bomba dosou o dobro.',
  },
  instructions: {
    en: 'Implement `createDoseCounter(limitMl)`, which returns `{ dose(ml), total(), remaining() }`:\n- `dose(ml)` adds to the total; if it would exceed the limit, it throws `Error("Exceeds the daily limit")` and adds nothing.\n- The total must not be modifiable from outside.\n- Each counter is independent.',
    es: 'Implementá `createDoseCounter(limitMl)`, que devuelve `{ dose(ml), total(), remaining() }`:\n- `dose(ml)` suma al total; si se pasaría del límite, lanza `Error("Exceeds the daily limit")` y no suma nada.\n- El total no debe poder modificarse desde afuera.\n- Cada contador es independiente.',
    'pt-BR':
      'Implemente `createDoseCounter(limitMl)`, que devolve `{ dose(ml), total(), remaining() }`:\n- `dose(ml)` soma ao total; se passaria do limite, lança `Error("Exceeds the daily limit")` e não soma nada.\n- O total não pode ser modificado de fora.\n- Cada contador é independente.',
  },
  starterCode: `class DoseCounter {
  constructor(limitMl) {
    this.limitMl = limitMl;
    this.totalMl = 0;
  }
  dose(ml) {
    this.totalMl += ml;
  }
  total() {
    return this.totalMl;
  }
  remaining() {
    return this.limitMl - this.totalMl;
  }
}

function createDoseCounter(limitMl) {
  return new DoseCounter(limitMl);
}
`,
  tests: [
    {
      name: { en: 'accumulates doses', es: 'acumula dosis', 'pt-BR': 'acumula doses' },
      code: `const counter = createDoseCounter(60);
counter.dose(20);
counter.dose(15);
expect(counter.total()).toBe(35);
expect(counter.remaining()).toBe(25);`,
    },
    {
      name: {
        en: 'does not allow exceeding the limit',
        es: 'no permite superar el límite',
        'pt-BR': 'não permite passar do limite',
      },
      code: `const counter = createDoseCounter(30);
counter.dose(25);
expect(() => counter.dose(10)).toThrow('Exceeds the daily limit');
expect(counter.total()).toBe(25);`,
    },
    {
      name: {
        en: 'the total cannot be touched from outside',
        es: 'el total no se puede tocar desde afuera',
        'pt-BR': 'o total não pode ser mexido de fora',
      },
      code: `const counter = createDoseCounter(50);
counter.dose(40);
try {
  counter.totalMl = 0;
  counter.total = () => 0;
} catch {
  // in strict mode, writing to a frozen object throws: that is fine too
}
expect(() => counter.dose(20)).toThrow('Exceeds the daily limit');`,
    },
    {
      name: {
        en: 'each counter is independent',
        es: 'cada contador es independiente',
        'pt-BR': 'cada contador é independente',
      },
      code: `const calcium = createDoseCounter(40);
const alk = createDoseCounter(40);
calcium.dose(30);
expect(alk.remaining()).toBe(40);`,
    },
  ],
  hints: {
    en: [
      'Keep the total in a local variable of `createDoseCounter`.',
      "Use that variable (not `this`) inside `dose`, and freeze the object you return so its functions can't be overwritten.",
    ],
    es: [
      'Guardá el total en una variable local de `createDoseCounter`.',
      'Usá esa variable (no `this`) dentro de `dose`, y congelá el objeto que devolvés para que no se puedan pisar sus funciones.',
    ],
    'pt-BR': [
      'Guarde o total em uma variável local de `createDoseCounter`.',
      'Use essa variável (não `this`) dentro de `dose` e congele o objeto que devolve para que suas funções não possam ser sobrescritas.',
    ],
  },
  solution: `function createDoseCounter(limitMl) {
  let totalMl = 0;

  return Object.freeze({
    dose(ml) {
      if (totalMl + ml > limitMl) throw new Error('Exceeds the daily limit');
      totalMl += ml;
    },
    total: () => totalMl,
    remaining: () => limitMl - totalMl,
  });
}
`,
};
