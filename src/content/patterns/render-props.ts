import type { Pattern } from '../types';

export const renderProps: Pattern = {
  id: 'render-props',
  rank: 29,
  name: 'Render Props',
  localName: { en: 'Render Props', es: 'Props de renderizado', 'pt-BR': 'Render props' },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'A component shares its state by calling a function it receives through props, which decides what to render.',
    es: 'Un componente comparte su estado llamando a una función que recibe por props y que decide qué renderizar.',
    'pt-BR':
      'Um componente compartilha seu estado chamando uma função que recebe por props e que decide o que renderizar.',
  },
  when: {
    en: 'When a component encapsulates logic or state and the consumer needs full control over the markup; handy in headless libraries.',
    es: 'Cuando un componente encapsula lógica o estado y el consumidor necesita control total sobre el marcado; útil en librerías headless.',
    'pt-BR':
      'Quando um componente encapsula lógica ou estado e o consumidor precisa de controle total sobre a marcação; útil em bibliotecas headless.',
  },
  pros: {
    en: [
      'Maximum presentation flexibility.',
      'Explicit dependencies: you can see which data the render receives.',
    ],
    es: [
      'Máxima flexibilidad de presentación.',
      'Dependencias explícitas: se ve qué datos recibe el render.',
    ],
    'pt-BR': [
      'Máxima flexibilidade de apresentação.',
      'Dependências explícitas: dá para ver quais dados o render recebe.',
    ],
  },
  cons: {
    en: [
      'Nesting several of them leads to JSX "callback hell".',
      'Inline functions on every render can break memoization.',
    ],
    es: [
      'Anidar varios produce el “callback hell” de JSX.',
      'Funciones inline en cada render pueden romper memoizaciones.',
    ],
    'pt-BR': [
      'Aninhar vários produz o "callback hell" do JSX.',
      'Funções inline a cada render podem quebrar memoizações.',
    ],
  },
  realWorld: {
    en: "Formik, Downshift, React Router v5's children-as-function, Headless UI slots, React Aria render props.",
    es: 'Formik, Downshift, el children-as-function de React Router v5, Headless UI con slots, los render props de React Aria.',
    'pt-BR':
      'Formik, Downshift, o children-as-function do React Router v5, Headless UI com slots, os render props do React Aria.',
  },
  example: {
    title: {
      en: 'Units with a render prop',
      es: 'Unidades con render prop',
      'pt-BR': 'Unidades com render prop',
    },
    scenario: {
      en: 'The same logic as withUnits, but the consumer decides the markup: one widget uses it in a heading, another in a tooltip.',
      es: 'La misma lógica de withUnits, pero el consumidor decide el marcado: un widget la usa en un título, otro en un tooltip.',
      'pt-BR':
        'A mesma lógica do withUnits, mas o consumidor decide a marcação: um widget a usa em um título, outro em um tooltip.',
    },
    code: `import { createElement as h, useState } from 'react';

export const Units = ({ children }) => {
  const [unit, setUnit] = useState('C');
  const format = (c) => (unit === 'F' ? ((c * 9) / 5 + 32).toFixed(1) + ' °F' : c + ' °C');
  const toggle = () => setUnit((u) => (u === 'C' ? 'F' : 'C'));
  // The component draws nothing of its own: it delegates to the children function
  return children({ unit, format, toggle });
};

export const SumpCard = ({ celsius }) =>
  h(Units, null, ({ format, toggle, unit }) =>
    h('div', null,
      h('h3', null, 'Sump ' + format(celsius)),
      h('button', { onClick: toggle }, 'Show in °' + (unit === 'C' ? 'F' : 'C')),
    ),
  );

// Compared with the HOC: the logic is the same, but here the consumer
// chooses what to render and there are no injected props to collide.`,
  },
  related: ['hoc', 'custom-hooks', 'compound-components', 'strategy'],
};
