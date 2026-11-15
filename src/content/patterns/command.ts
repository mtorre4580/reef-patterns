import type { Pattern } from '../types';

export const command: Pattern = {
  id: 'command',
  rank: 13,
  name: 'Command',
  localName: { en: 'Command', es: 'Comando', 'pt-BR': 'Comando' },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'Turns an action into an object with everything needed to execute it, undo it or queue it.',
    es: 'Convierte una acción en un objeto con todo lo necesario para ejecutarla, deshacerla o encolarla.',
    'pt-BR':
      'Transforma uma ação em um objeto com tudo o que é preciso para executá-la, desfazê-la ou enfileirá-la.',
  },
  when: {
    en: 'When you need undo/redo, history, task queues, macros or retrying actions later.',
    es: 'Cuando necesitás deshacer/rehacer, un historial, colas de tareas, macros o reintentar acciones más tarde.',
    'pt-BR':
      'Quando você precisa de desfazer/refazer, histórico, filas de tarefas, macros ou repetir ações mais tarde.',
  },
  pros: {
    en: [
      'Undo and redo come almost for free.',
      'Actions can be stored, queued and replayed.',
      'Separates who requests the action from who runs it.',
    ],
    es: [
      'Deshacer y rehacer salen casi gratis.',
      'Las acciones se pueden guardar, encolar y reproducir.',
      'Separa quién pide la acción de quién la ejecuta.',
    ],
    'pt-BR': [
      'Desfazer e refazer saem quase de graça.',
      'As ações podem ser guardadas, enfileiradas e reproduzidas.',
      'Separa quem pede a ação de quem a executa.',
    ],
  },
  cons: {
    en: [
      'A class or object per action adds a lot of code.',
      'Undoing actions with external effects (network) is not always possible.',
    ],
    es: [
      'Una clase o un objeto por acción suma mucho código.',
      'Deshacer acciones con efectos externos (red) no siempre es posible.',
    ],
    'pt-BR': [
      'Uma classe ou objeto por ação soma muito código.',
      'Desfazer ações com efeitos externos (rede) nem sempre é possível.',
    ],
  },
  realWorld: {
    en: 'Undo/redo in editors such as ProseMirror and Monaco, Redux actions, VS Code commands, BullMQ queues.',
    es: 'El undo/redo de editores como ProseMirror y Monaco, las acciones de Redux, los comandos de VS Code, las colas de BullMQ.',
    'pt-BR':
      'O desfazer/refazer de editores como ProseMirror e Monaco, as actions do Redux, os comandos do VS Code, as filas do BullMQ.',
  },
  example: {
    title: {
      en: 'Undo in a text editor',
      es: 'Deshacer en un editor de texto',
      'pt-BR': 'Desfazer em um editor de texto',
    },
    scenario: {
      en: 'The notes editor needs undo for typing and deleting. Every edit becomes an object that knows how to apply and revert itself.',
      es: 'El editor de notas necesita deshacer al escribir y borrar. Cada edición es un objeto que sabe aplicarse y revertirse.',
      'pt-BR':
        'O editor de notas precisa de desfazer ao digitar e apagar. Cada edição vira um objeto que sabe se aplicar e se reverter.',
    },
    code: `class InsertText {
  constructor(doc, text) {
    this.doc = doc;
    this.text = text;
  }
  execute() {
    this.doc.content += this.text;
  }
  undo() {
    this.doc.content = this.doc.content.slice(0, -this.text.length);
  }
}

class Editor {
  #history = [];
  constructor(doc) {
    this.doc = doc;
  }
  run(command) {
    command.execute();
    this.#history.push(command);
  }
  undo() {
    this.#history.pop()?.undo();
  }
}

const doc = { content: '' };
const editor = new Editor(doc);
editor.run(new InsertText(doc, 'Hello'));
editor.run(new InsertText(doc, ', wrld')); // typo!
editor.undo();
editor.run(new InsertText(doc, ', world'));
console.log(doc.content); // 'Hello, world'`,
  },
  related: ['memento', 'chain-of-responsibility', 'flux', 'strategy'],
};
