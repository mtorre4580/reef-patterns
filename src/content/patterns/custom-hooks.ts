import type { Pattern } from '../types';

export const customHooks: Pattern = {
  id: 'custom-hooks',
  rank: 23,
  name: 'Custom Hooks',
  nameEs: 'Hooks personalizados',
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: 'Extrae lógica con estado y efectos de un componente a una función use… reutilizable.',
  when: 'Cuando dos o más componentes repiten la misma combinación de estado, efectos y suscripciones, o cuando un componente mezcla lógica y marcado.',
  pros: [
    'Reutiliza lógica sin cambiar la jerarquía de componentes.',
    'Componentes más cortos y enfocados en el marcado.',
    'La lógica se testea aislada con renderHook.',
  ],
  cons: [
    'Las reglas de los hooks (orden fijo, solo en componentes) siguen aplicando.',
    'Un hook que hace demasiado esconde re-renders costosos.',
  ],
  realWorld:
    'useQuery de TanStack Query, useForm de react-hook-form, useSWR, las colecciones de hooks como usehooks-ts.',
  example: {
    title: 'useWaterParams',
    scenario:
      'Tres pantallas muestran parámetros del agua y todas repetían el mismo polling a la API del controlador. El hook encapsula lectura, intervalo, carga y error.',
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

// Uso en cualquier componente:
// const { params, loading } = useWaterParams(controllerApi);`,
  },
  related: ['hoc', 'render-props', 'provider', 'mvvm'],
};
