import type { Pattern } from '../types';

export const containerPresentational: Pattern = {
  id: 'container-presentational',
  rank: 26,
  name: 'Container / Presentational',
  localName: {
    en: 'Container / Presentational',
    es: 'Contenedor y presentación',
    'pt-BR': 'Contêiner e apresentação',
  },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'Separates the component that fetches and manages data from the one that only displays it from props.',
    es: 'Separa el componente que obtiene y maneja datos del que solo los muestra a partir de props.',
    'pt-BR':
      'Separa o componente que obtém e gerencia dados daquele que só os mostra a partir de props.',
  },
  when: {
    en: 'When a component mixes fetching, state and markup, and you want to reuse the view with other data or show it in Storybook without a backend.',
    es: 'Cuando un componente mezcla fetching, estado y marcado, y querés reutilizar la vista con otros datos o mostrarla en Storybook sin backend.',
    'pt-BR':
      'Quando um componente mistura fetching, estado e marcação e você quer reutilizar a visão com outros dados ou mostrá-la no Storybook sem backend.',
  },
  pros: {
    en: [
      'Pure, reusable and easy-to-test presentational components.',
      'Data logic lives in a single place.',
    ],
    es: [
      'Componentes de presentación puros, reutilizables y fáciles de testear.',
      'La lógica de datos queda en un solo lugar.',
    ],
    'pt-BR': [
      'Componentes de apresentação puros, reutilizáveis e fáceis de testar.',
      'A lógica de dados fica em um só lugar.',
    ],
  },
  cons: {
    en: [
      'With hooks, a custom hook and a single component are sometimes enough.',
      'Doubles the number of files.',
    ],
    es: [
      'Con hooks, a veces alcanza con un custom hook y un solo componente.',
      'Duplica la cantidad de archivos.',
    ],
    'pt-BR': [
      'Com hooks, às vezes basta um custom hook e um único componente.',
      'Duplica a quantidade de arquivos.',
    ],
  },
  realWorld: {
    en: 'Popularized by Dan Abramov in the Redux era (connect); today it shows up as server components that fetch data and client components that display it.',
    es: 'Popularizado por Dan Abramov en la era de Redux (connect); hoy aparece como componentes de servidor que obtienen datos y componentes de cliente que los muestran.',
    'pt-BR':
      'Popularizado por Dan Abramov na era do Redux (connect); hoje aparece como server components que obtêm dados e client components que os mostram.',
  },
  example: {
    title: { en: 'Coral list', es: 'Lista de corales', 'pt-BR': 'Lista de corais' },
    scenario: {
      en: 'CoralListContainer fetches the inventory and handles loading; CoralList only receives an array and draws it, and is reused on the frag sales screen.',
      es: 'CoralListContainer obtiene el inventario y maneja la carga; CoralList solo recibe un array y lo dibuja, y se reutiliza en la pantalla de venta de frags.',
      'pt-BR':
        'CoralListContainer obtém o inventário e cuida do carregamento; CoralList só recebe um array e o desenha, e é reutilizado na tela de venda de frags.',
    },
    code: `import { createElement as h, useEffect, useState } from 'react';

// Presentational: no state, no fetching, only props
export const CoralList = ({ corals, onSelect }) => {
  if (corals.length === 0) return h('p', null, 'No corals yet.');
  return h(
    'ul',
    null,
    corals.map((coral) =>
      h('li', { key: coral.id },
        h('button', { onClick: () => onSelect(coral) }, coral.name + ' · ' + coral.type),
      ),
    ),
  );
};

// Container: data and effects, no markup of its own
export const CoralListContainer = ({ repository, onSelect }) => {
  const [corals, setCorals] = useState(null);

  useEffect(() => {
    repository.findAll().then(setCorals);
  }, [repository]);

  if (corals === null) return h('p', { role: 'status' }, 'Loading inventory…');
  return h(CoralList, { corals, onSelect });
};`,
  },
  related: ['mvc', 'custom-hooks', 'hoc'],
};
