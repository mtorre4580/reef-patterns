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
    title: { en: 'useFetch', es: 'useFetch', 'pt-BR': 'useFetch' },
    scenario: {
      en: 'Several screens fetched data with the same useState/useEffect dance and forgot to cancel requests when unmounting. The hook wraps loading, error and abort.',
      es: 'Varias pantallas traían datos con el mismo baile de useState/useEffect y se olvidaban de cancelar el request al desmontar. El hook encapsula carga, error y abort.',
      'pt-BR':
        'Várias telas buscavam dados com a mesma dança de useState/useEffect e esqueciam de cancelar a requisição ao desmontar. O hook encapsula carregamento, erro e abort.',
    },
    code: `import { useEffect, useState } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('HTTP ' + res.status))))
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      });

    // Cancel the request if the component unmounts or the URL changes
    return () => controller.abort();
  }, [url]);

  return { data, error, loading: data === null && error === null };
}

// Usage in any component:
// const { data: user, loading } = useFetch('/api/users/' + id);`,
  },
  related: ['hoc', 'render-props', 'provider', 'mvvm'],
};
