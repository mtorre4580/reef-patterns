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
      en: 'Data fetching with a render prop',
      es: 'Datos con render prop',
      'pt-BR': 'Dados com render prop',
    },
    scenario: {
      en: 'The same fetching logic feeds a table on one page and a small card on another. The consumer decides the markup; the component only provides the state.',
      es: 'La misma lógica de fetch alimenta una tabla en una página y una tarjeta chica en otra. El consumidor decide el marcado; el componente solo aporta el estado.',
      'pt-BR':
        'A mesma lógica de busca alimenta uma tabela em uma página e um card pequeno em outra. O consumidor decide a marcação; o componente só fornece o estado.',
    },
    code: `import { createElement as h, useEffect, useState } from 'react';

export const Fetch = ({ load, children }) => {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    load()
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => setState({ data: null, error, loading: false }));
  }, [load]);
  // The component draws nothing of its own: it delegates to the children function
  return children(state);
};

export const RevenueCard = ({ loadRevenue }) =>
  h(Fetch, { load: loadRevenue }, ({ data, loading, error }) => {
    if (loading) return h('p', null, 'Loading…');
    if (error) return h('p', { role: 'alert' }, 'Could not load revenue');
    return h('p', null, 'Revenue this month: $' + data.total);
  });

// Compared with a HOC: the logic is the same, but here the consumer
// chooses what to render and there are no injected props to collide.`,
  },
  related: ['hoc', 'custom-hooks', 'compound-components', 'strategy'],
};
