import type { Pattern } from '../types';

export const containerPresentational: Pattern = {
  id: 'container-presentational',
  rank: 26,
  name: 'Container / Presentational',
  nameEs: 'Contenedor y presentación',
  category: 'frontend',
  tier: 2,
  gof: false,
  summary:
    'Separa el componente que obtiene y maneja datos del que solo los muestra a partir de props.',
  when: 'Cuando un componente mezcla fetching, estado y marcado, y querés reutilizar la vista con otros datos o mostrarla en Storybook sin backend.',
  pros: [
    'Componentes de presentación puros, reutilizables y fáciles de testear.',
    'La lógica de datos queda en un solo lugar.',
  ],
  cons: [
    'Con hooks, a veces alcanza con un custom hook y un solo componente.',
    'Duplica la cantidad de archivos.',
  ],
  realWorld:
    'Popularizado por Dan Abramov en la era de Redux (connect); hoy aparece como componentes de servidor que obtienen datos y componentes de cliente que los muestran.',
  example: {
    title: 'Lista de corales',
    scenario:
      'CoralListContainer obtiene el inventario y maneja la carga; CoralList solo recibe un array y lo dibuja, y se reutiliza en la pantalla de venta de frags.',
    code: `import { createElement as h, useEffect, useState } from 'react';

// Presentación: sin estado, sin fetch, solo props
export function CoralList({ corals, onSelect }) {
  if (corals.length === 0) return h('p', null, 'No hay corales cargados.');
  return h(
    'ul',
    null,
    corals.map((coral) =>
      h('li', { key: coral.id },
        h('button', { onClick: () => onSelect(coral) }, coral.name + ' · ' + coral.type),
      ),
    ),
  );
}

// Contenedor: datos y efectos, sin marcado propio
export function CoralListContainer({ repository, onSelect }) {
  const [corals, setCorals] = useState(null);

  useEffect(() => {
    repository.findAll().then(setCorals);
  }, [repository]);

  if (corals === null) return h('p', { role: 'status' }, 'Cargando inventario…');
  return h(CoralList, { corals, onSelect });
}`,
  },
  related: ['mvc', 'custom-hooks', 'hoc'],
};
