import type { Pattern } from '../types';

export const flux: Pattern = {
  id: 'flux',
  rank: 25,
  name: 'Flux',
  nameEs: 'Flujo unidireccional',
  category: 'frontend',
  tier: 2,
  gof: false,
  summary:
    'El estado vive en un store y solo cambia despachando acciones a un reducer puro; la vista se suscribe y vuelve a renderizar.',
  when: 'Cuando el estado compartido lo modifican muchas pantallas y necesitás saber exactamente qué lo cambió, en qué orden y por qué.',
  pros: [
    'Cambios predecibles y trazables: cada uno es una acción.',
    'Reducers puros, fáciles de testear.',
    'Habilita devtools, time travel y persistencia.',
  ],
  cons: [
    'Mucho boilerplate para estado local o simple.',
    'Indirección: para un cambio hay acción, reducer y selector.',
  ],
  realWorld:
    'Redux y Redux Toolkit, useReducer de React, Zustand, NgRx, Vuex/Pinia con sus acciones.',
  example: {
    title: 'Store del acuario',
    scenario:
      'El dashboard, el planificador y la consola manual cambian el mismo estado: dosis, lecturas y bombas. Todo pasa por acciones para poder auditarlo.',
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
