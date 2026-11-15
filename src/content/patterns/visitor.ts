import type { Pattern } from '../types';

export const visitor: Pattern = {
  id: 'visitor',
  rank: 43,
  name: 'Visitor',
  localName: { en: 'Visitor', es: 'Visitante', 'pt-BR': 'Visitante' },
  category: 'comportamiento',
  tier: 4,
  gof: true,
  summary: {
    en: 'Separates an operation from the object structure it works on, so new operations can be added without touching those objects.',
    es: 'Separa una operación de la estructura de objetos sobre la que opera, para agregar operaciones nuevas sin tocar esos objetos.',
    'pt-BR':
      'Separa uma operação da estrutura de objetos sobre a qual ela opera, para adicionar operações novas sem mexer nesses objetos.',
  },
  when: {
    en: 'When the structure (an AST, a node tree) is stable but you often add different operations to it: export, validate, compute costs.',
    es: 'Cuando la estructura (un AST, un árbol de nodos) es estable pero le agregás operaciones distintas seguido: exportar, validar, calcular costos.',
    'pt-BR':
      'Quando a estrutura (uma AST, uma árvore de nós) é estável, mas você adiciona operações diferentes com frequência: exportar, validar, calcular custos.',
  },
  pros: {
    en: [
      'Adding operations does not modify the nodes.',
      'Each operation is grouped in a single object.',
    ],
    es: [
      'Agregar operaciones no modifica los nodos.',
      'Cada operación queda agrupada en un solo objeto.',
    ],
    'pt-BR': [
      'Adicionar operações não modifica os nós.',
      'Cada operação fica agrupada em um único objeto.',
    ],
  },
  cons: {
    en: [
      'Adding a node type forces you to update every visitor.',
      'Partially breaks node encapsulation.',
    ],
    es: [
      'Agregar un tipo de nodo obliga a actualizar todos los visitantes.',
      'Rompe parcialmente el encapsulamiento de los nodos.',
    ],
    'pt-BR': [
      'Adicionar um tipo de nó obriga a atualizar todos os visitantes.',
      'Quebra parcialmente o encapsulamento dos nós.',
    ],
  },
  realWorld: {
    en: 'Babel and ESLint visitors, acorn-walk, TypeScript transformers, Markdown renderers such as remark.',
    es: 'Los visitors de Babel y ESLint, acorn-walk, los transformadores de TypeScript, los renderers de Markdown como remark.',
    'pt-BR':
      'Os visitors do Babel e do ESLint, acorn-walk, os transformers do TypeScript, os renderizadores de Markdown como o remark.',
  },
  example: {
    title: {
      en: 'Exporting a document tree',
      es: 'Exportar un árbol de documento',
      'pt-BR': 'Exportar uma árvore de documento',
    },
    scenario: {
      en: 'The CMS stores pages as a tree of headings, paragraphs and lists. One visitor exports HTML, another counts words for the SEO panel. The node types do not change.',
      es: 'El CMS guarda las páginas como un árbol de títulos, párrafos y listas. Un visitante exporta HTML, otro cuenta palabras para el panel de SEO. Los tipos de nodo no cambian.',
      'pt-BR':
        'O CMS guarda as páginas como uma árvore de títulos, parágrafos e listas. Um visitante exporta HTML, outro conta palavras para o painel de SEO. Os tipos de nó não mudam.',
    },
    code: `const page = [
  { kind: 'heading', level: 1, text: 'Pricing' },
  { kind: 'paragraph', text: 'Simple plans for teams of any size.' },
  { kind: 'list', items: ['Free trial', 'Cancel anytime'] },
];

// Each visitor defines what to do with each node type
const toHtml = {
  heading: (n) => '<h' + n.level + '>' + n.text + '</h' + n.level + '>',
  paragraph: (n) => '<p>' + n.text + '</p>',
  list: (n) => '<ul>' + n.items.map((i) => '<li>' + i + '</li>').join('') + '</ul>',
};

const words = (text) => text.split(/\\s+/).filter(Boolean).length;
const wordCount = {
  heading: (n) => words(n.text),
  paragraph: (n) => words(n.text),
  list: (n) => n.items.reduce((sum, i) => sum + words(i), 0),
};

const visit = (nodes, visitor) => nodes.map((node) => visitor[node.kind](node));

console.log(visit(page, toHtml).join('\\n'));
console.log('Words:', visit(page, wordCount).reduce((a, b) => a + b, 0)); // 12`,
  },
  related: ['composite', 'iterator', 'interpreter'],
};
