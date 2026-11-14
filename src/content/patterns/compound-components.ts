import type { Pattern } from '../types';

export const compoundComponents: Pattern = {
  id: 'compound-components',
  rank: 27,
  name: 'Compound Components',
  nameEs: 'Componentes compuestos',
  category: 'frontend',
  tier: 2,
  gof: false,
  summary:
    'Un componente padre y sus subcomponentes comparten estado implícito y se componen libremente en el marcado.',
  when: 'Cuando un componente tiene partes que el usuario quiere ordenar o personalizar (pestañas, menús, acordeones) y una prop por cada variante se vuelve inmanejable.',
  pros: [
    'API declarativa y flexible: el consumidor decide la estructura.',
    'Evita el “prop explosion” de componentes configurables.',
    'El estado compartido queda encapsulado.',
  ],
  cons: [
    'Los subcomponentes fuera del padre fallan (hay que validarlo).',
    'El estado implícito vía Context es menos evidente que las props.',
  ],
  realWorld:
    'Radix UI y shadcn/ui (Dialog.Trigger, Dialog.Content), Headless UI, Reach UI, los <select>/<option> nativos de HTML.',
  example: {
    title: '<Tank> con luz y bomba',
    scenario:
      'El panel de un acuario muestra su luz y su bomba, pero cada usuario arma el orden que prefiere. Todas las piezas leen y cambian el mismo estado del tanque.',
    code: `import { createContext, createElement as h, useContext, useState } from 'react';

const TankContext = createContext(null);

function useTank() {
  const ctx = useContext(TankContext);
  if (!ctx) throw new Error('Los componentes Tank.* van dentro de <Tank>');
  return ctx;
}

export function Tank({ name, children }) {
  const [state, setState] = useState({ light: false, pump: true });
  const toggle = (device) => setState((s) => ({ ...s, [device]: !s[device] }));
  return h(TankContext.Provider, { value: { state, toggle } },
    h('section', { 'aria-label': name }, children),
  );
}

Tank.Light = function TankLight() {
  const { state, toggle } = useTank();
  return h('button', { 'aria-pressed': state.light, onClick: () => toggle('light') }, 'Luz');
};

Tank.Pump = function TankPump() {
  const { state, toggle } = useTank();
  return h('button', { 'aria-pressed': state.pump, onClick: () => toggle('pump') }, 'Bomba');
};

// <Tank name="Nano 60 L"><Tank.Pump /><Tank.Light /></Tank>`,
  },
  related: ['provider', 'composite', 'render-props'],
};
