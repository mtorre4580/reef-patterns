import type { Pattern } from '../types';

export const compoundComponents: Pattern = {
  id: 'compound-components',
  rank: 27,
  name: 'Compound Components',
  localName: {
    en: 'Compound Components',
    es: 'Componentes compuestos',
    'pt-BR': 'Componentes compostos',
  },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'A parent component and its subcomponents share implicit state and are freely composed in the markup.',
    es: 'Un componente padre y sus subcomponentes comparten estado implícito y se componen libremente en el marcado.',
    'pt-BR':
      'Um componente pai e seus subcomponentes compartilham estado implícito e se compõem livremente na marcação.',
  },
  when: {
    en: 'When a component has parts users want to reorder or customize (tabs, menus, accordions) and one prop per variant becomes unmanageable.',
    es: 'Cuando un componente tiene partes que el usuario quiere ordenar o personalizar (pestañas, menús, acordeones) y una prop por cada variante se vuelve inmanejable.',
    'pt-BR':
      'Quando um componente tem partes que o usuário quer ordenar ou personalizar (abas, menus, acordeões) e uma prop por variante fica impossível de manter.',
  },
  pros: {
    en: [
      'A declarative, flexible API: the consumer decides the structure.',
      'Avoids the "prop explosion" of configurable components.',
      'The shared state stays encapsulated.',
    ],
    es: [
      'API declarativa y flexible: el consumidor decide la estructura.',
      'Evita el “prop explosion” de componentes configurables.',
      'El estado compartido queda encapsulado.',
    ],
    'pt-BR': [
      'API declarativa e flexível: o consumidor decide a estrutura.',
      'Evita a "explosão de props" dos componentes configuráveis.',
      'O estado compartilhado fica encapsulado.',
    ],
  },
  cons: {
    en: [
      'Subcomponents fail outside their parent (it has to be validated).',
      'Implicit state through Context is less obvious than props.',
    ],
    es: [
      'Los subcomponentes fuera del padre fallan (hay que validarlo).',
      'El estado implícito vía Context es menos evidente que las props.',
    ],
    'pt-BR': [
      'Os subcomponentes fora do pai falham (é preciso validar).',
      'O estado implícito via Context é menos evidente que as props.',
    ],
  },
  realWorld: {
    en: 'Radix UI and shadcn/ui (Dialog.Trigger, Dialog.Content), Headless UI, Reach UI, native HTML <select>/<option>.',
    es: 'Radix UI y shadcn/ui (Dialog.Trigger, Dialog.Content), Headless UI, Reach UI, los <select>/<option> nativos de HTML.',
    'pt-BR':
      'Radix UI e shadcn/ui (Dialog.Trigger, Dialog.Content), Headless UI, Reach UI, os <select>/<option> nativos do HTML.',
  },
  example: {
    title: {
      en: '<Tank> with light and pump',
      es: '<Tank> con luz y bomba',
      'pt-BR': '<Tank> com luz e bomba',
    },
    scenario: {
      en: 'A tank panel shows its light and its pump, but each user arranges them in the order they prefer. Every piece reads and changes the same tank state.',
      es: 'El panel de un acuario muestra su luz y su bomba, pero cada usuario arma el orden que prefiere. Todas las piezas leen y cambian el mismo estado del tanque.',
      'pt-BR':
        'O painel de um aquário mostra sua luz e sua bomba, mas cada usuário monta a ordem que prefere. Todas as peças leem e mudam o mesmo estado do aquário.',
    },
    code: `import { createContext, createElement as h, useContext, useState } from 'react';

const TankContext = createContext(null);

const useTank = () => {
  const ctx = useContext(TankContext);
  if (!ctx) throw new Error('Tank.* components must be used inside <Tank>');
  return ctx;
};

export const Tank = ({ name, children }) => {
  const [state, setState] = useState({ light: false, pump: true });
  const toggle = (device) => setState((s) => ({ ...s, [device]: !s[device] }));
  return h(TankContext.Provider, { value: { state, toggle } },
    h('section', { 'aria-label': name }, children),
  );
};

Tank.Light = () => {
  const { state, toggle } = useTank();
  return h('button', { 'aria-pressed': state.light, onClick: () => toggle('light') }, 'Light');
};

Tank.Pump = () => {
  const { state, toggle } = useTank();
  return h('button', { 'aria-pressed': state.pump, onClick: () => toggle('pump') }, 'Pump');
};

// <Tank name="Nano 60 L"><Tank.Pump /><Tank.Light /></Tank>`,
  },
  related: ['provider', 'composite', 'render-props'],
};
