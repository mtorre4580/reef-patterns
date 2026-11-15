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
      en: 'Feature flag targeting rules',
      es: 'Reglas de segmentación de feature flags',
      'pt-BR': 'Regras de segmentação de feature flags',
    },
    scenario: {
      en: 'Product managers define rollout rules like "plan is pro and country is AR or BR". Each rule is stored as a tree and evaluated against the current user.',
      es: 'Los product managers definen reglas de rollout como "el plan es pro y el país es AR o BR". Cada regla se guarda como un árbol y se evalúa con el usuario actual.',
      'pt-BR':
        'Os product managers definem regras de rollout como "o plano é pro e o país é AR ou BR". Cada regra é guardada como uma árvore e avaliada com o usuário atual.',
    },
    code: `const expr = {
  attr: (name) => ({ evaluate: (user) => user[name] }),
  value: (v) => ({ evaluate: () => v }),
  equals: (a, b) => ({ evaluate: (user) => a.evaluate(user) === b.evaluate(user) }),
  oneOf: (a, list) => ({ evaluate: (user) => list.includes(a.evaluate(user)) }),
  and: (...rules) => ({ evaluate: (user) => rules.every((r) => r.evaluate(user)) }),
  or: (...rules) => ({ evaluate: (user) => rules.some((r) => r.evaluate(user)) }),
};

// "plan is pro and country is AR or BR"
const newBillingRule = expr.and(
  expr.equals(expr.attr('plan'), expr.value('pro')),
  expr.oneOf(expr.attr('country'), ['AR', 'BR']),
);

console.log(newBillingRule.evaluate({ plan: 'pro', country: 'BR' })); // true
console.log(newBillingRule.evaluate({ plan: 'free', country: 'BR' })); // false
console.log(newBillingRule.evaluate({ plan: 'pro', country: 'US' })); // false`,
  },
  related: ['composite', 'specification', 'visitor'],
};
