import type { Pattern } from '../types';

export const hoc: Pattern = {
  id: 'hoc',
  rank: 28,
  name: 'Higher-Order Component',
  nameEs: 'Componente de orden superior',
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: 'Una función recibe un componente y devuelve otro que le agrega props o comportamiento.',
  when: 'Cuando querés aplicar la misma capacidad transversal (permisos, unidades, tracking) a muchos componentes sin modificarlos; hoy suele preferirse un hook.',
  pros: [
    'Reutiliza comportamiento sin tocar el componente envuelto.',
    'Funciona con componentes de clase y de función.',
  ],
  cons: [
    'Colisiones de props y “wrapper hell” en las devtools.',
    'El tipado de props inyectadas es incómodo.',
    'Los hooks resolvieron la mayoría de sus casos de uso.',
  ],
  realWorld:
    'connect de react-redux, withRouter de React Router v5, React.memo y forwardRef, withAuthenticationRequired de Auth0.',
  example: {
    title: 'withUnits',
    scenario:
      'Varios widgets heredados muestran temperaturas y necesitan formatearlas en la unidad del usuario. withUnits les inyecta un formateador sin reescribirlos.',
    code: `import { createElement as h } from 'react';

// Fuente de las preferencias (en una app real vendría de Context)
const preferences = { temp: 'F' };

export function withUnits(Component) {
  function WithUnits(props) {
    const formatTemp = (c) =>
      preferences.temp === 'F' ? ((c * 9) / 5 + 32).toFixed(1) + ' °F' : c.toFixed(1) + ' °C';
    return h(Component, { ...props, formatTemp });
  }
  WithUnits.displayName = 'withUnits(' + (Component.displayName || Component.name) + ')';
  return WithUnits;
}

// Componente original: no sabe de dónde salen las unidades
function SumpTemperature({ celsius, formatTemp }) {
  return h('p', null, 'Sump: ' + formatTemp(celsius));
}

export const SumpTemperatureWithUnits = withUnits(SumpTemperature);
// <SumpTemperatureWithUnits celsius={25.4} /> → "Sump: 77.7 °F"`,
  },
  related: ['decorator', 'render-props', 'custom-hooks'],
};
