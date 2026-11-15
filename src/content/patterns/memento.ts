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
      en: 'Draft snapshots in a rich editor',
      es: 'Snapshots de borradores en un editor',
      'pt-BR': 'Snapshots de rascunhos em um editor',
    },
    scenario: {
      en: 'Before running "format document" or an AI rewrite, the editor saves a snapshot. If the user does not like the result, it goes back to the previous state in one step.',
      es: 'Antes de "formatear documento" o de una reescritura con IA, el editor guarda un snapshot. Si al usuario no le gusta el resultado, vuelve al estado anterior en un paso.',
      'pt-BR':
        'Antes de "formatar documento" ou de uma reescrita com IA, o editor salva um snapshot. Se o usuário não gostar do resultado, volta ao estado anterior em um passo.',
    },
    code: `class DocumentEditor {
  #state = { title: 'Release notes', body: 'fixed  login bug', cursor: 16 };

  apply(change) {
    this.#state = { ...this.#state, ...change };
  }
  describe() {
    return JSON.stringify(this.#state);
  }

  // Create and restore mementos: nobody else touches #state
  save() {
    return Object.freeze({ state: structuredClone(this.#state), at: Date.now() });
  }
  restore(memento) {
    this.#state = structuredClone(memento.state);
  }
}

const editor = new DocumentEditor();
const history = [];

history.push(editor.save());
editor.apply({ body: 'We are thrilled to announce a revolutionary login experience!!!', cursor: 0 });
console.log(editor.describe()); // the AI rewrite went too far

editor.restore(history.pop());
console.log(editor.describe()); // back to the previous draft`,
  },
  related: ['command', 'state', 'event-sourcing'],
};
