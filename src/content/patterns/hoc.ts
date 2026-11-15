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
    title: { en: 'withFeatureFlag', es: 'withFeatureFlag', 'pt-BR': 'withFeatureFlag' },
    scenario: {
      en: 'New widgets ship behind feature flags. withFeatureFlag wraps any component and renders it only when the flag is on, without changing the component.',
      es: 'Los widgets nuevos salen detrás de feature flags. withFeatureFlag envuelve cualquier componente y lo muestra solo si el flag está activo, sin cambiar el componente.',
      'pt-BR':
        'Os widgets novos saem atrás de feature flags. withFeatureFlag envolve qualquer componente e só o mostra se a flag estiver ativa, sem mudar o componente.',
    },
    code: `import { createElement as h } from 'react';

// Where flags come from (in a real app, a flags service or Context)
const flags = { newCheckout: true, darkReports: false };

export const withFeatureFlag = (Component, flag, Fallback = () => null) => {
  const WithFeatureFlag = (props) =>
    flags[flag] ? h(Component, props) : h(Fallback, props);
  WithFeatureFlag.displayName =
    'withFeatureFlag(' + (Component.displayName || Component.name) + ')';
  return WithFeatureFlag;
};

// Original component: it knows nothing about flags
const NewCheckoutButton = ({ total }) => h('button', null, 'Pay $' + total);

export const CheckoutButton = withFeatureFlag(NewCheckoutButton, 'newCheckout');
// <CheckoutButton total={59} /> renders only while newCheckout is on`,
  },
  related: ['decorator', 'render-props', 'custom-hooks'],
};
