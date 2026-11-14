import type { Pattern } from '../types';

export const memento: Pattern = {
  id: 'memento',
  rank: 32,
  name: 'Memento',
  localName: { en: 'Memento', es: 'Recuerdo', 'pt-BR': 'Memento' },
  category: 'comportamiento',
  tier: 3,
  gof: true,
  summary: {
    en: "Captures a snapshot of an object's internal state so it can be restored later, without exposing its details.",
    es: 'Captura una instantánea del estado interno de un objeto para poder restaurarlo después, sin exponer sus detalles.',
    'pt-BR':
      'Captura um instantâneo do estado interno de um objeto para poder restaurá-lo depois, sem expor seus detalhes.',
  },
  when: {
    en: 'When you need to go back to a whole previous state (undo, drafts, checkpoints) and rebuilding it with inverse commands would be complex.',
    es: 'Cuando necesitás volver a un estado anterior completo (deshacer, borradores, checkpoints) y recalcularlo con comandos inversos sería complejo.',
    'pt-BR':
      'Quando você precisa voltar a um estado anterior completo (desfazer, rascunhos, checkpoints) e recalculá-lo com comandos inversos seria complexo.',
  },
  pros: {
    en: [
      'Simple undo: restore the whole snapshot.',
      "Respects the original object's encapsulation.",
    ],
    es: [
      'Deshacer simple: se restaura la foto completa.',
      'Respeta el encapsulamiento del objeto original.',
    ],
    'pt-BR': [
      'Desfazer simples: restaura-se a foto completa.',
      'Respeita o encapsulamento do objeto original.',
    ],
  },
  cons: {
    en: [
      'Keeping many large snapshots uses memory.',
      'You must decide how many to keep and when to drop them.',
    ],
    es: [
      'Guardar muchas instantáneas grandes consume memoria.',
      'Hay que decidir cuántas conservar y cuándo descartarlas.',
    ],
    'pt-BR': [
      'Guardar muitos instantâneos grandes consome memória.',
      'É preciso decidir quantos manter e quando descartá-los.',
    ],
  },
  realWorld: {
    en: "Redux DevTools state history, structuredClone for checkpoints, autosaved drafts, Excalidraw's history.",
    es: 'El historial de estados de Redux DevTools, structuredClone para checkpoints, los borradores autoguardados, el historial de Excalidraw.',
    'pt-BR':
      'O histórico de estados do Redux DevTools, structuredClone para checkpoints, os rascunhos salvos automaticamente, o histórico do Excalidraw.',
  },
  example: {
    title: {
      en: 'Lighting profiles',
      es: 'Perfiles de iluminación',
      'pt-BR': 'Perfis de iluminação',
    },
    scenario: {
      en: 'While tuning the lamp channels you try combinations. Before experimenting you save a snapshot, and if the corals look bad you go back to the previous profile.',
      es: 'Mientras ajustás los canales de la lámpara probás combinaciones. Antes de experimentar guardás una foto, y si los corales se ven mal, volvés al perfil anterior.',
      'pt-BR':
        'Enquanto ajusta os canais da luminária você testa combinações. Antes de experimentar, salva uma foto e, se os corais ficarem mal, volta ao perfil anterior.',
    },
    code: `class LightProfile {
  #channels = { blue: 80, white: 40, uv: 20 };

  set(channel, percent) {
    this.#channels[channel] = percent;
  }
  describe() {
    return JSON.stringify(this.#channels);
  }

  // Create and restore mementos: nobody else touches #channels
  save() {
    return Object.freeze({ channels: structuredClone(this.#channels), at: Date.now() });
  }
  restore(memento) {
    this.#channels = structuredClone(memento.channels);
  }
}

const profile = new LightProfile();
const history = [];

history.push(profile.save());
profile.set('white', 90);
profile.set('uv', 0);
console.log(profile.describe()); // too much white: the SPS is bleaching

profile.restore(history.pop());
console.log(profile.describe()); // back to { blue: 80, white: 40, uv: 20 }`,
  },
  related: ['command', 'state', 'event-sourcing'],
};
