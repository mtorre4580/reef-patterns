import type { Pattern } from '../types';

export const provider: Pattern = {
  id: 'provider',
  rank: 24,
  name: 'Provider',
  nameEs: 'Proveedor',
  category: 'frontend',
  tier: 2,
  gof: false,
  summary:
    'Un componente en lo alto del árbol pone datos o servicios a disposición de todos sus descendientes sin pasarlos por props.',
  when: 'Cuando un valor (tema, usuario, unidades, cliente de API) lo necesitan componentes en muchos niveles y pasarlo por props genera prop drilling.',
  pros: [
    'Elimina el prop drilling.',
    'Funciona como inyección de dependencias: se cambia el valor en tests.',
    'Varios providers anidados permiten sobrescribir valores por sección.',
  ],
  cons: [
    'Cada cambio del valor re-renderiza a todos los consumidores.',
    'Las dependencias se vuelven implícitas: no se ven en las props.',
  ],
  realWorld:
    'React Context, ThemeProvider de styled-components, QueryClientProvider, el provide/inject de Vue.',
  example: {
    title: 'ReefProvider con unidades preferidas',
    scenario:
      'Algunos usuarios miden en °C y ppt, otros en °F y gravedad específica. Cada lectura de la app se formatea según la preferencia, sin pasarla por diez niveles de props.',
    code: `import { createContext, createElement as h, useContext, useMemo, useState } from 'react';

const UnitsContext = createContext(null);

export function ReefProvider({ children, initial = { temp: 'C', salinity: 'ppt' } }) {
  const [units, setUnits] = useState(initial);
  const value = useMemo(() => ({ units, setUnits }), [units]);
  return h(UnitsContext.Provider, { value }, children);
}

export function useUnits() {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error('useUnits debe usarse dentro de <ReefProvider>');
  return ctx;
}

// Un componente profundo en el árbol formatea sin recibir props extra
export function TemperatureReading({ celsius }) {
  const { units } = useUnits();
  const text = units.temp === 'F' ? (celsius * 9) / 5 + 32 + ' °F' : celsius + ' °C';
  return h('span', null, text);
}

// <ReefProvider initial={{ temp: 'F', salinity: 'sg' }}><Dashboard /></ReefProvider>`,
  },
  related: ['dependency-injection', 'custom-hooks', 'singleton', 'compound-components'],
};
