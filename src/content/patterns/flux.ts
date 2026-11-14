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
    title: { en: 'Tank store', es: 'Store del acuario', 'pt-BR': 'Store do aquário' },
    scenario: {
      en: 'The dashboard, the scheduler and the manual console change the same state: doses, readings and pumps. Everything goes through actions so it can be audited.',
      es: 'El dashboard, el planificador y la consola manual cambian el mismo estado: dosis, lecturas y bombas. Todo pasa por acciones para poder auditarlo.',
      'pt-BR':
        'O dashboard, o agendador e o console manual mudam o mesmo estado: doses, leituras e bombas. Tudo passa por ações para poder ser auditado.',
    },
    code: `const initialState = { dosedMl: 0, readings: [], pumps: { return: true, wave: true } };

function reefReducer(state, action) {
  switch (action.type) {
    case 'DOSE':
      return { ...state, dosedMl: state.dosedMl + action.ml };
    case 'READ_PARAM':
      return { ...state, readings: [...state.readings, action.reading] };
    case 'TOGGLE_PUMP':
      return { ...state, pumps: { ...state.pumps, [action.pump]: !state.pumps[action.pump] } };
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

const store = createStore(reefReducer, initialState);
store.subscribe((s) => console.log('Render:', s.dosedMl, s.pumps));
store.dispatch({ type: 'DOSE', ml: 12 });
store.dispatch({ type: 'TOGGLE_PUMP', pump: 'wave' });`,
  },
  related: ['observer', 'command', 'cqrs', 'state'],
};
