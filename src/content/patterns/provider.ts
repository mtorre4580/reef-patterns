import type { Pattern } from '../types';

export const provider: Pattern = {
  id: 'provider',
  rank: 24,
  name: 'Provider',
  localName: { en: 'Provider', es: 'Proveedor', 'pt-BR': 'Provedor' },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'A component high in the tree makes data or services available to all its descendants without passing them through props.',
    es: 'Un componente en lo alto del árbol pone datos o servicios a disposición de todos sus descendientes sin pasarlos por props.',
    'pt-BR':
      'Um componente no alto da árvore disponibiliza dados ou serviços para todos os seus descendentes sem passá-los por props.',
  },
  when: {
    en: 'When a value (theme, user, units, API client) is needed by components at many levels and passing it through props causes prop drilling.',
    es: 'Cuando un valor (tema, usuario, unidades, cliente de API) lo necesitan componentes en muchos niveles y pasarlo por props genera prop drilling.',
    'pt-BR':
      'Quando um valor (tema, usuário, unidades, cliente de API) é necessário em componentes de muitos níveis e passá-lo por props gera prop drilling.',
  },
  pros: {
    en: [
      'Removes prop drilling.',
      'Works as dependency injection: swap the value in tests.',
      'Nested providers let you override values per section.',
    ],
    es: [
      'Elimina el prop drilling.',
      'Funciona como inyección de dependencias: se cambia el valor en tests.',
      'Varios providers anidados permiten sobrescribir valores por sección.',
    ],
    'pt-BR': [
      'Elimina o prop drilling.',
      'Funciona como injeção de dependências: troca-se o valor nos testes.',
      'Vários providers aninhados permitem sobrescrever valores por seção.',
    ],
  },
  cons: {
    en: [
      'Every change to the value re-renders all consumers.',
      "Dependencies become implicit: they don't show up in props.",
    ],
    es: [
      'Cada cambio del valor re-renderiza a todos los consumidores.',
      'Las dependencias se vuelven implícitas: no se ven en las props.',
    ],
    'pt-BR': [
      'Cada mudança do valor re-renderiza todos os consumidores.',
      'As dependências ficam implícitas: não aparecem nas props.',
    ],
  },
  realWorld: {
    en: "React Context, styled-components' ThemeProvider, QueryClientProvider, Vue's provide/inject.",
    es: 'React Context, ThemeProvider de styled-components, QueryClientProvider, el provide/inject de Vue.',
    'pt-BR':
      'React Context, o ThemeProvider do styled-components, o QueryClientProvider, o provide/inject do Vue.',
  },
  example: {
    title: {
      en: 'ReefProvider with preferred units',
      es: 'ReefProvider con unidades preferidas',
      'pt-BR': 'ReefProvider com unidades preferidas',
    },
    scenario: {
      en: 'Some users measure in °C and ppt, others in °F and specific gravity. Every reading in the app is formatted to their preference without passing it through ten levels of props.',
      es: 'Algunos usuarios miden en °C y ppt, otros en °F y gravedad específica. Cada lectura de la app se formatea según la preferencia, sin pasarla por diez niveles de props.',
      'pt-BR':
        'Alguns usuários medem em °C e ppt, outros em °F e densidade. Cada leitura do app é formatada conforme a preferência, sem passá-la por dez níveis de props.',
    },
    code: `import { createContext, createElement as h, useContext, useMemo, useState } from 'react';

const UnitsContext = createContext(null);

export const ReefProvider = ({ children, initial = { temp: 'C', salinity: 'ppt' } }) => {
  const [units, setUnits] = useState(initial);
  const value = useMemo(() => ({ units, setUnits }), [units]);
  return h(UnitsContext.Provider, { value }, children);
};

export const useUnits = () => {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error('useUnits must be used inside <ReefProvider>');
  return ctx;
};

// A component deep in the tree formats readings without extra props
export const TemperatureReading = ({ celsius }) => {
  const { units } = useUnits();
  const text = units.temp === 'F' ? (celsius * 9) / 5 + 32 + ' °F' : celsius + ' °C';
  return h('span', null, text);
};

// <ReefProvider initial={{ temp: 'F', salinity: 'sg' }}><Dashboard /></ReefProvider>`,
  },
  related: ['dependency-injection', 'custom-hooks', 'singleton', 'compound-components'],
};
