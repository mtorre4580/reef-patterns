import type { Pattern } from '../types';

export const interpreter: Pattern = {
  id: 'interpreter',
  rank: 44,
  name: 'Interpreter',
  localName: { en: 'Interpreter', es: 'Intérprete', 'pt-BR': 'Intérprete' },
  category: 'comportamiento',
  tier: 4,
  gof: true,
  summary: {
    en: 'Represents a small grammar as a tree of objects that know how to evaluate themselves.',
    es: 'Representa una gramática pequeña como un árbol de objetos que saben evaluarse a sí mismos.',
    'pt-BR': 'Representa uma gramática pequena como uma árvore de objetos que sabem se avaliar.',
  },
  when: {
    en: 'When users need to express rules in a mini-language (filters, conditions, formulas) and the grammar is simple.',
    es: 'Cuando los usuarios necesitan expresar reglas en un mini lenguaje (filtros, condiciones, fórmulas) y la gramática es simple.',
    'pt-BR':
      'Quando os usuários precisam expressar regras em uma minilinguagem (filtros, condições, fórmulas) e a gramática é simples.',
  },
  pros: {
    en: [
      'Rules are added as data, without deploying code.',
      'Each grammar rule is a small, testable piece.',
    ],
    es: [
      'Las reglas se agregan como datos, sin desplegar código.',
      'Cada regla de la gramática es una pieza chica y testeable.',
    ],
    'pt-BR': [
      'As regras são adicionadas como dados, sem publicar código.',
      'Cada regra da gramática é uma peça pequena e testável.',
    ],
  },
  cons: {
    en: [
      'Large grammars become slow and hard to maintain.',
      'For real languages, a generated parser is better.',
    ],
    es: [
      'Gramáticas grandes se vuelven lentas y difíciles de mantener.',
      'Para lenguajes reales conviene un parser generado.',
    ],
    'pt-BR': [
      'Gramáticas grandes ficam lentas e difíceis de manter.',
      'Para linguagens reais convém um parser gerado.',
    ],
  },
  realWorld: {
    en: 'Feature flag rule engines, JSONLogic expressions, CSS selectors, Handlebars templates.',
    es: 'Los motores de reglas de feature flags, las expresiones de JSONLogic, los selectores CSS, las plantillas de Handlebars.',
    'pt-BR':
      'Os motores de regras de feature flags, as expressões do JSONLogic, os seletores CSS, os templates do Handlebars.',
  },
  example: {
    title: {
      en: 'Automation rules',
      es: 'Reglas de automatización',
      'pt-BR': 'Regras de automação',
    },
    scenario: {
      en: 'The user defines rules like "if temperature > 27 and hour between 12 and 18, turn on the fans". Each rule is stored as a tree and evaluated against the current readings.',
      es: 'El usuario define reglas como “si temperatura > 27 y hora entre 12 y 18, encender ventiladores”. Cada regla se guarda como un árbol y se evalúa con las lecturas actuales.',
      'pt-BR':
        'O usuário define regras como "se temperatura > 27 e hora entre 12 e 18, ligar os ventiladores". Cada regra é guardada como uma árvore e avaliada com as leituras atuais.',
    },
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

// "temperature > 27 and hour between 12 and 18"
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
