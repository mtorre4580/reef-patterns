import type { Pattern } from '../types';

export const hoc: Pattern = {
  id: 'hoc',
  rank: 28,
  name: 'Higher-Order Component',
  localName: {
    en: 'Higher-Order Component',
    es: 'Componente de orden superior',
    'pt-BR': 'Componente de ordem superior',
  },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'A function receives a component and returns another one that adds props or behavior.',
    es: 'Una función recibe un componente y devuelve otro que le agrega props o comportamiento.',
    'pt-BR':
      'Uma função recebe um componente e devolve outro que lhe adiciona props ou comportamento.',
  },
  when: {
    en: 'When you want to apply the same cross-cutting capability (permissions, units, tracking) to many components without modifying them; today a hook is usually preferred.',
    es: 'Cuando querés aplicar la misma capacidad transversal (permisos, unidades, tracking) a muchos componentes sin modificarlos; hoy suele preferirse un hook.',
    'pt-BR':
      'Quando você quer aplicar a mesma capacidade transversal (permissões, unidades, tracking) a muitos componentes sem modificá-los; hoje costuma-se preferir um hook.',
  },
  pros: {
    en: [
      'Reuses behavior without touching the wrapped component.',
      'Works with both class and function components.',
    ],
    es: [
      'Reutiliza comportamiento sin tocar el componente envuelto.',
      'Funciona con componentes de clase y de función.',
    ],
    'pt-BR': [
      'Reutiliza comportamento sem mexer no componente envolvido.',
      'Funciona com componentes de classe e de função.',
    ],
  },
  cons: {
    en: [
      'Prop collisions and "wrapper hell" in the devtools.',
      'Typing injected props is awkward.',
      'Hooks solved most of its use cases.',
    ],
    es: [
      'Colisiones de props y “wrapper hell” en las devtools.',
      'El tipado de props inyectadas es incómodo.',
      'Los hooks resolvieron la mayoría de sus casos de uso.',
    ],
    'pt-BR': [
      'Colisões de props e "wrapper hell" nas devtools.',
      'A tipagem das props injetadas é incômoda.',
      'Os hooks resolveram a maioria dos seus casos de uso.',
    ],
  },
  realWorld: {
    en: "react-redux's connect, React Router v5's withRouter, React.memo and forwardRef, Auth0's withAuthenticationRequired.",
    es: 'connect de react-redux, withRouter de React Router v5, React.memo y forwardRef, withAuthenticationRequired de Auth0.',
    'pt-BR':
      'connect do react-redux, withRouter do React Router v5, React.memo e forwardRef, withAuthenticationRequired do Auth0.',
  },
  example: {
    title: { en: 'withUnits', es: 'withUnits', 'pt-BR': 'withUnits' },
    scenario: {
      en: "Several legacy widgets show temperatures and need to format them in the user's unit. withUnits injects a formatter without rewriting them.",
      es: 'Varios widgets heredados muestran temperaturas y necesitan formatearlas en la unidad del usuario. withUnits les inyecta un formateador sin reescribirlos.',
      'pt-BR':
        'Vários widgets legados mostram temperaturas e precisam formatá-las na unidade do usuário. withUnits injeta um formatador sem reescrevê-los.',
    },
    code: `import { createElement as h } from 'react';

// Where preferences come from (in a real app, from Context)
const preferences = { temp: 'F' };

export const withUnits = (Component) => {
  const WithUnits = (props) => {
    const formatTemp = (c) =>
      preferences.temp === 'F' ? ((c * 9) / 5 + 32).toFixed(1) + ' °F' : c.toFixed(1) + ' °C';
    return h(Component, { ...props, formatTemp });
  };
  WithUnits.displayName = 'withUnits(' + (Component.displayName || Component.name) + ')';
  return WithUnits;
};

// Original component: it does not know where the units come from
const SumpTemperature = ({ celsius, formatTemp }) => h('p', null, 'Sump: ' + formatTemp(celsius));

export const SumpTemperatureWithUnits = withUnits(SumpTemperature);
// <SumpTemperatureWithUnits celsius={25.4} /> → "Sump: 77.7 °F"`,
  },
  related: ['decorator', 'render-props', 'custom-hooks'],
};
