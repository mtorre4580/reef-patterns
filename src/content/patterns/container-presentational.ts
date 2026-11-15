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
    title: { en: 'User list', es: 'Lista de usuarios', 'pt-BR': 'Lista de usuários' },
    scenario: {
      en: 'UserListContainer fetches users and handles loading; UserList only receives an array and draws it, and is reused in the admin panel and in Storybook.',
      es: 'UserListContainer trae los usuarios y maneja la carga; UserList solo recibe un array y lo dibuja, y se reutiliza en el panel de admin y en Storybook.',
      'pt-BR':
        'UserListContainer busca os usuários e cuida do carregamento; UserList só recebe um array e o desenha, e é reutilizado no painel de admin e no Storybook.',
    },
    code: `import { createElement as h, useEffect, useState } from 'react';

// Presentational: no state, no fetching, only props
export const UserList = ({ users, onSelect }) => {
  if (users.length === 0) return h('p', null, 'No users yet.');
  return h(
    'ul',
    null,
    users.map((user) =>
      h('li', { key: user.id },
        h('button', { onClick: () => onSelect(user) }, user.name + ' · ' + user.role),
      ),
    ),
  );
};

// Container: data and effects, no markup of its own
export const UserListContainer = ({ api, onSelect }) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    api.listUsers().then(setUsers);
  }, [api]);

  if (users === null) return h('p', { role: 'status' }, 'Loading users…');
  return h(UserList, { users, onSelect });
};`,
  },
  related: ['mvc', 'custom-hooks', 'hoc'],
};
