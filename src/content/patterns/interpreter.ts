import type { Pattern } from '../types';

export const interpreter: Pattern = {
  id: 'interpreter',
  rank: 44,
  name: 'Interpreter',
  nameEs: 'Intérprete',
  category: 'comportamiento',
  tier: 4,
  gof: true,
  summary:
    'Representa una gramática pequeña como un árbol de objetos que saben evaluarse a sí mismos.',
  when: 'Cuando los usuarios necesitan expresar reglas en un mini lenguaje (filtros, condiciones, fórmulas) y la gramática es simple.',
  pros: [
    'Las reglas se agregan como datos, sin desplegar código.',
    'Cada regla de la gramática es una pieza chica y testeable.',
  ],
  cons: [
    'Gramáticas grandes se vuelven lentas y difíciles de mantener.',
    'Para lenguajes reales conviene un parser generado.',
  ],
  realWorld:
    'Los motores de reglas de feature flags, las expresiones de JSONLogic, los selectores CSS, las plantillas de Handlebars.',
  example: {
    title: 'Reglas de automatización',
    scenario:
      'El usuario define reglas como “si temperatura > 27 y hora entre 12 y 18, encender ventiladores”. Cada regla se guarda como un árbol y se evalúa con las lecturas actuales.',
    code: `const expr = {
  value: (name) => ({ evaluate: (ctx) => ctx[name] }),
  number: (n) => ({ evaluate: () => n }),
  greater: (a, b) => ({ evaluate: (ctx) => a.evaluate(ctx) > b.evaluate(ctx) }),
  between: (a, min, max) => ({
    evaluate: (ctx) => a.evaluate(ctx) >= min && a.evaluate(ctx) <= max,
  }),
  and: (...rules) => ({ evaluate: (ctx) => rules.every((r) => r.evaluate(ctx)) }),
  or: (...rules) => ({ evaluate: (ctx) => rules.some((r) => r.evaluate(ctx)) }),
};

// "temperatura > 27 y hora entre 12 y 18"
const fansRule = expr.and(
  expr.greater(expr.value('temp'), expr.number(27)),
  expr.between(expr.value('hour'), 12, 18),
);

console.log(fansRule.evaluate({ temp: 27.6, hour: 15 })); // true
console.log(fansRule.evaluate({ temp: 27.6, hour: 21 })); // false
console.log(fansRule.evaluate({ temp: 25.9, hour: 15 })); // false`,
  },
  related: ['composite', 'specification', 'visitor'],
};
