import type { Challenge } from '../../types';

export const module2: Challenge = {
  id: 'module-2',
  patternId: 'module',
  title: 'Límite diario de dosificación',
  difficulty: 'media',
  story:
    'Cada bomba de la dosificadora tiene un límite diario de seguridad. Con una clase de campos públicos, un bug en el panel puso el total en cero y la bomba dosificó el doble.',
  instructions:
    'Implementá `createDoseCounter(limitMl)`, que devuelve `{ dose(ml), total(), remaining() }`:\n' +
    '- `dose(ml)` suma al total; si se pasaría del límite, lanza `Error("Supera el límite diario")` y no suma nada.\n' +
    '- El total no debe poder modificarse desde afuera.\n' +
    '- Cada contador es independiente.',
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
      name: 'acumula dosis',
      code: `const counter = createDoseCounter(60);
counter.dose(20);
counter.dose(15);
expect(counter.total()).toBe(35);
expect(counter.remaining()).toBe(25);`,
    },
    {
      name: 'no permite superar el límite',
      code: `const counter = createDoseCounter(30);
counter.dose(25);
expect(() => counter.dose(10)).toThrow('Supera el límite diario');
expect(counter.total()).toBe(25);`,
    },
    {
      name: 'el total no se puede tocar desde afuera',
      code: `const counter = createDoseCounter(50);
counter.dose(40);
try {
  counter.totalMl = 0;
  counter.total = () => 0;
} catch {
  // en modo estricto, escribir en un objeto congelado lanza: también vale
}
expect(() => counter.dose(20)).toThrow('Supera el límite diario');`,
    },
    {
      name: 'cada contador es independiente',
      code: `const calcium = createDoseCounter(40);
const alk = createDoseCounter(40);
calcium.dose(30);
expect(alk.remaining()).toBe(40);`,
    },
  ],
  hints: [
    'Guardá el total en una variable local de `createDoseCounter`.',
    'Usá esa variable (no `this`) dentro de `dose`, y congelá el objeto que devolvés para que no se puedan pisar sus funciones.',
  ],
  solution: `function createDoseCounter(limitMl) {
  let totalMl = 0;

  return Object.freeze({
    dose(ml) {
      if (totalMl + ml > limitMl) throw new Error('Supera el límite diario');
      totalMl += ml;
    },
    total: () => totalMl,
    remaining: () => limitMl - totalMl,
  });
}
`,
};
