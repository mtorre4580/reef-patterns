import type { Pattern } from '../types';

export const customHooks: Pattern = {
  id: 'custom-hooks',
  rank: 23,
  name: 'Custom Hooks',
  localName: { en: 'Custom Hooks', es: 'Hooks personalizados', 'pt-BR': 'Hooks personalizados' },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'Extracts stateful logic and effects from a component into a reusable use… function.',
    es: 'Extrae lógica con estado y efectos de un componente a una función use… reutilizable.',
    'pt-BR':
      'Extrai lógica com estado e efeitos de um componente para uma função use… reutilizável.',
  },
  when: {
    en: 'When two or more components repeat the same mix of state, effects and subscriptions, or when a component mixes logic and markup.',
    es: 'Cuando dos o más componentes repiten la misma combinación de estado, efectos y suscripciones, o cuando un componente mezcla lógica y marcado.',
    'pt-BR':
      'Quando dois ou mais componentes repetem a mesma combinação de estado, efeitos e assinaturas, ou quando um componente mistura lógica e marcação.',
  },
  pros: {
    en: [
      'Reuses logic without changing the component tree.',
      'Shorter components focused on markup.',
      'The logic is tested in isolation with renderHook.',
    ],
    es: [
      'Reutiliza lógica sin cambiar la jerarquía de componentes.',
      'Componentes más cortos y enfocados en el marcado.',
      'La lógica se testea aislada con renderHook.',
    ],
    'pt-BR': [
      'Reutiliza lógica sem mudar a hierarquia de componentes.',
      'Componentes mais curtos e focados na marcação.',
      'A lógica é testada isoladamente com renderHook.',
    ],
  },
  cons: {
    en: [
      'The rules of hooks (fixed order, only inside components) still apply.',
      'A hook that does too much hides expensive re-renders.',
    ],
    es: [
      'Las reglas de los hooks (orden fijo, solo en componentes) siguen aplicando.',
      'Un hook que hace demasiado esconde re-renders costosos.',
    ],
    'pt-BR': [
      'As regras dos hooks (ordem fixa, só em componentes) continuam valendo.',
      'Um hook que faz demais esconde re-renders caros.',
    ],
  },
  realWorld: {
    en: "TanStack Query's useQuery, react-hook-form's useForm, useSWR, hook collections such as usehooks-ts.",
    es: 'useQuery de TanStack Query, useForm de react-hook-form, useSWR, las colecciones de hooks como usehooks-ts.',
    'pt-BR':
      'useQuery do TanStack Query, useForm do react-hook-form, useSWR, coleções de hooks como usehooks-ts.',
  },
  example: {
    title: { en: 'useWaterParams', es: 'useWaterParams', 'pt-BR': 'useWaterParams' },
    scenario: {
      en: "Three screens show water parameters and all of them repeated the same polling against the controller's API. The hook wraps reading, interval, loading and error.",
      es: 'Tres pantallas muestran parámetros del agua y todas repetían el mismo polling a la API del controlador. El hook encapsula lectura, intervalo, carga y error.',
      'pt-BR':
        'Três telas mostram parâmetros da água e todas repetiam o mesmo polling na API do controlador. O hook encapsula leitura, intervalo, carregamento e erro.',
    },
    code: `import { useEffect, useState } from 'react';

export function useWaterParams(api, { intervalMs = 60_000 } = {}) {
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const data = await api.readParams(); // { temp, ph, salinity }
        if (!cancelled) setParams(data);
      } catch (err) {
        if (!cancelled) setError(err);
      }
    }

    poll();
    const id = setInterval(poll, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [api, intervalMs]);

  return { params, error, loading: params === null && error === null };
}

// Usage in any component:
// const { params, loading } = useWaterParams(controllerApi);`,
  },
  related: ['hoc', 'render-props', 'provider', 'mvvm'],
};
