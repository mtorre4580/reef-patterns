import type { Pattern } from '../types';

export const flux: Pattern = {
  id: 'flux',
  rank: 25,
  name: 'Flux',
  localName: { en: 'Flux', es: 'Flujo unidireccional', 'pt-BR': 'Fluxo unidirecional' },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'State lives in a store and only changes by dispatching actions to a pure reducer; the view subscribes and re-renders.',
    es: 'El estado vive en un store y solo cambia despachando acciones a un reducer puro; la vista se suscribe y vuelve a renderizar.',
    'pt-BR':
      'O estado vive em um store e só muda despachando ações para um reducer puro; a visão assina e re-renderiza.',
  },
  when: {
    en: 'When shared state is changed from many screens and you need to know exactly what changed it, in which order and why.',
    es: 'Cuando el estado compartido lo modifican muchas pantallas y necesitás saber exactamente qué lo cambió, en qué orden y por qué.',
    'pt-BR':
      'Quando o estado compartilhado é modificado por muitas telas e você precisa saber exatamente o que o mudou, em que ordem e por quê.',
  },
  pros: {
    en: [
      'Predictable, traceable changes: each one is an action.',
      'Pure reducers, easy to test.',
      'Enables devtools, time travel and persistence.',
    ],
    es: [
      'Cambios predecibles y trazables: cada uno es una acción.',
      'Reducers puros, fáciles de testear.',
      'Habilita devtools, time travel y persistencia.',
    ],
    'pt-BR': [
      'Mudanças previsíveis e rastreáveis: cada uma é uma ação.',
      'Reducers puros, fáceis de testar.',
      'Habilita devtools, time travel e persistência.',
    ],
  },
  cons: {
    en: [
      'A lot of boilerplate for local or simple state.',
      'Indirection: one change needs an action, a reducer and a selector.',
    ],
    es: [
      'Mucho boilerplate para estado local o simple.',
      'Indirección: para un cambio hay acción, reducer y selector.',
    ],
    'pt-BR': [
      'Muito boilerplate para estado local ou simples.',
      'Indireção: para uma mudança há ação, reducer e seletor.',
    ],
  },
  realWorld: {
    en: "Redux and Redux Toolkit, React's useReducer, Zustand, NgRx, Vuex/Pinia with their actions.",
    es: 'Redux y Redux Toolkit, useReducer de React, Zustand, NgRx, Vuex/Pinia con sus acciones.',
    'pt-BR':
      'Redux e Redux Toolkit, useReducer do React, Zustand, NgRx, Vuex/Pinia com suas ações.',
  },
  example: {
    title: {
      en: 'Cart store with actions',
      es: 'Store del carrito con acciones',
      'pt-BR': 'Store do carrinho com ações',
    },
    scenario: {
      en: 'The product page, the mini cart and the checkout change the same cart. Everything goes through actions so bugs can be traced and replayed.',
      es: 'La página de producto, el mini carrito y el checkout cambian el mismo carrito. Todo pasa por acciones para poder rastrear y reproducir bugs.',
      'pt-BR':
        'A página de produto, o mini carrinho e o checkout mudam o mesmo carrinho. Tudo passa por ações para poder rastrear e reproduzir bugs.',
    },
    code: `const initialState = { items: [], coupon: null };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.sku !== action.sku) };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.code };
    default:
      return state;
  }
}

function createStore(reducer, state) {
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

const store = createStore(cartReducer, initialState);
store.subscribe((s) => console.log('Render:', s.items.length, 'items', s.coupon ?? ''));
store.dispatch({ type: 'ADD_ITEM', item: { sku: 'TSHIRT-M', price: 20 } });
store.dispatch({ type: 'APPLY_COUPON', code: 'WELCOME10' });`,
  },
  related: ['observer', 'command', 'cqrs', 'state'],
};
