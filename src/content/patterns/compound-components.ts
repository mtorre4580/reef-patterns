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
      en: '<Tabs> with tabs and panels',
      es: '<Tabs> con pestañas y paneles',
      'pt-BR': '<Tabs> com abas e painéis',
    },
    scenario: {
      en: 'The settings page uses tabs, and each team wants a different layout. All pieces share the active tab without passing props around.',
      es: 'La página de configuración usa pestañas y cada equipo quiere un layout distinto. Todas las piezas comparten la pestaña activa sin pasar props.',
      'pt-BR':
        'A página de configurações usa abas e cada time quer um layout diferente. Todas as peças compartilham a aba ativa sem passar props.',
    },
    code: `import { createContext, createElement as h, useContext, useState } from 'react';

const TabsContext = createContext(null);

const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* components must be used inside <Tabs>');
  return ctx;
};

export const Tabs = ({ defaultValue, children }) => {
  const [active, setActive] = useState(defaultValue);
  return h(TabsContext.Provider, { value: { active, setActive } }, h('div', null, children));
};

Tabs.Tab = ({ value, children }) => {
  const { active, setActive } = useTabs();
  return h('button', { role: 'tab', 'aria-selected': active === value, onClick: () => setActive(value) }, children);
};

Tabs.Panel = ({ value, children }) => {
  const { active } = useTabs();
  return active === value ? h('div', { role: 'tabpanel' }, children) : null;
};

// <Tabs defaultValue="profile">
//   <Tabs.Tab value="profile">Profile</Tabs.Tab><Tabs.Tab value="billing">Billing</Tabs.Tab>
//   <Tabs.Panel value="profile">…</Tabs.Panel><Tabs.Panel value="billing">…</Tabs.Panel>
// </Tabs>`,
  },
  related: ['provider', 'composite', 'render-props'],
};
