import type { Pattern } from '../types';

export const optimisticUi: Pattern = {
  id: 'optimistic-ui',
  rank: 38,
  name: 'Optimistic UI',
  nameEs: 'Interfaz optimista',
  category: 'frontend',
  tier: 3,
  gof: false,
  summary:
    'Muestra el resultado de una acción de inmediato, como si ya hubiera tenido éxito, y lo revierte si el servidor falla.',
  when: 'Cuando la acción casi siempre funciona (likes, toggles, reordenar) y esperar la respuesta del servidor hace sentir lenta la interfaz.',
  pros: ['La interfaz se siente instantánea.', 'Reduce spinners y estados de carga.'],
  cons: [
    'Revertir confunde si no se comunica bien el error.',
    'Conflictos cuando varias acciones optimistas se pisan.',
  ],
  realWorld:
    'useOptimistic de React 19, onMutate de TanStack Query, la caché optimista de Apollo, los likes de cualquier red social.',
  example: {
    title: 'Prender la bomba de olas',
    scenario:
      'Al tocar el switch de la bomba de olas, la app la muestra encendida al instante. Si el controlador no responde, vuelve al estado anterior y avisa.',
    code: `function createPumpStore(api) {
  let state = { wave: false, error: null };
  const listeners = new Set();
  const set = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
  };

  return {
    subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    async toggleWave() {
      const previous = state.wave;
      set({ wave: !previous, error: null }); // 1. optimista: cambia ya
      try {
        await api.setPump('wave', !previous); // 2. confirma en segundo plano
      } catch {
        set({ wave: previous, error: 'No se pudo cambiar la bomba' }); // 3. revierte
      }
    },
  };
}

const flakyApi = { setPump: () => Promise.reject(new Error('timeout')) };
const store = createPumpStore(flakyApi);
store.subscribe((s) => console.log('Render:', s));
store.toggleWave(); // Render: wave true… y luego wave false con error`,
  },
  related: ['command', 'flux', 'memento'],
};
