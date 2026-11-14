import type { Pattern } from '../types';

export const optimisticUi: Pattern = {
  id: 'optimistic-ui',
  rank: 38,
  name: 'Optimistic UI',
  localName: { en: 'Optimistic UI', es: 'Interfaz optimista', 'pt-BR': 'Interface otimista' },
  category: 'frontend',
  tier: 3,
  gof: false,
  summary: {
    en: 'Shows the result of an action right away, as if it had already succeeded, and reverts it if the server fails.',
    es: 'Muestra el resultado de una acción de inmediato, como si ya hubiera tenido éxito, y lo revierte si el servidor falla.',
    'pt-BR':
      'Mostra o resultado de uma ação na hora, como se já tivesse dado certo, e o reverte se o servidor falhar.',
  },
  when: {
    en: 'When the action almost always works (likes, toggles, reordering) and waiting for the server makes the UI feel slow.',
    es: 'Cuando la acción casi siempre funciona (likes, toggles, reordenar) y esperar la respuesta del servidor hace sentir lenta la interfaz.',
    'pt-BR':
      'Quando a ação quase sempre funciona (curtidas, toggles, reordenar) e esperar a resposta do servidor faz a interface parecer lenta.',
  },
  pros: {
    en: ['The interface feels instant.', 'Fewer spinners and loading states.'],
    es: ['La interfaz se siente instantánea.', 'Reduce spinners y estados de carga.'],
    'pt-BR': ['A interface parece instantânea.', 'Reduz spinners e estados de carregamento.'],
  },
  cons: {
    en: [
      'Reverting is confusing if the error is not communicated well.',
      'Conflicts when several optimistic actions overlap.',
    ],
    es: [
      'Revertir confunde si no se comunica bien el error.',
      'Conflictos cuando varias acciones optimistas se pisan.',
    ],
    'pt-BR': [
      'Reverter confunde se o erro não for bem comunicado.',
      'Conflitos quando várias ações otimistas se sobrepõem.',
    ],
  },
  realWorld: {
    en: "React 19's useOptimistic, TanStack Query's onMutate, Apollo's optimistic cache, likes on any social network.",
    es: 'useOptimistic de React 19, onMutate de TanStack Query, la caché optimista de Apollo, los likes de cualquier red social.',
    'pt-BR':
      'useOptimistic do React 19, onMutate do TanStack Query, o cache otimista do Apollo, as curtidas de qualquer rede social.',
  },
  example: {
    title: {
      en: 'Turning on the wave pump',
      es: 'Prender la bomba de olas',
      'pt-BR': 'Ligar a bomba de ondas',
    },
    scenario: {
      en: "When you tap the wave pump switch, the app shows it on immediately. If the controller doesn't answer, it goes back to the previous state and warns you.",
      es: 'Al tocar el switch de la bomba de olas, la app la muestra encendida al instante. Si el controlador no responde, vuelve al estado anterior y avisa.',
      'pt-BR':
        'Ao tocar no switch da bomba de ondas, o app a mostra ligada na hora. Se o controlador não responder, volta ao estado anterior e avisa.',
    },
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
      set({ wave: !previous, error: null }); // 1. optimistic: change now
      try {
        await api.setPump('wave', !previous); // 2. confirm in the background
      } catch {
        set({ wave: previous, error: 'Could not switch the pump' }); // 3. revert
      }
    },
  };
}

const flakyApi = { setPump: () => Promise.reject(new Error('timeout')) };
const store = createPumpStore(flakyApi);
store.subscribe((s) => console.log('Render:', s));
store.toggleWave(); // Render: wave true… and then wave false with an error`,
  },
  related: ['command', 'flux', 'memento'],
};
