import type { Pattern } from '../types';

export const renderProps: Pattern = {
  id: 'render-props',
  rank: 29,
  name: 'Render Props',
  nameEs: 'Props de renderizado',
  category: 'frontend',
  tier: 2,
  gof: false,
  summary:
    'Un componente comparte su estado llamando a una función que recibe por props y que decide qué renderizar.',
  when: 'Cuando un componente encapsula lógica o estado y el consumidor necesita control total sobre el marcado; útil en librerías headless.',
  pros: [
    'Máxima flexibilidad de presentación.',
    'Dependencias explícitas: se ve qué datos recibe el render.',
  ],
  cons: [
    'Anidar varios produce el “callback hell” de JSX.',
    'Funciones inline en cada render pueden romper memoizaciones.',
  ],
  realWorld:
    'Formik, Downshift, el children-as-function de React Router v5, Headless UI con slots, los render props de React Aria.',
  example: {
    title: 'Unidades con render prop',
    scenario:
      'La misma lógica de withUnits, pero el consumidor decide el marcado: un widget la usa en un título, otro en un tooltip.',
    code: `import { createElement as h, useState } from 'react';

export function Units({ children }) {
  const [unit, setUnit] = useState('C');
  const format = (c) => (unit === 'F' ? ((c * 9) / 5 + 32).toFixed(1) + ' °F' : c + ' °C');
  const toggle = () => setUnit((u) => (u === 'C' ? 'F' : 'C'));
  // El componente no dibuja nada propio: delega en la función children
  return children({ unit, format, toggle });
}

export function SumpCard({ celsius }) {
  return h(Units, null, ({ format, toggle, unit }) =>
    h('div', null,
      h('h3', null, 'Sump ' + format(celsius)),
      h('button', { onClick: toggle }, 'Ver en °' + (unit === 'C' ? 'F' : 'C')),
    ),
  );
}

// Comparación con el HOC: la lógica es la misma, pero acá el consumidor
// elige qué renderizar y no hay props inyectadas que puedan colisionar.`,
  },
  related: ['hoc', 'custom-hooks', 'compound-components', 'strategy'],
};
