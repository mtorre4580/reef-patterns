import type { Challenge } from '../../types';

export const command1: Challenge = {
  id: 'command-1',
  patternId: 'command',
  title: {
    en: 'Text editor with undo',
    es: 'Editor de texto con deshacer',
    'pt-BR': 'Editor de texto com desfazer',
  },
  difficulty: 'media',
  story: {
    en: 'The notes app has no undo. Users lose text when they paste over a paragraph by mistake. Every edit should be undoable, and the history should be visible for debugging.',
    es: 'La app de notas no tiene deshacer. Los usuarios pierden texto cuando pegan encima de un párrafo por error. Cada edición debería poder deshacerse, y el historial tendría que verse para depurar.',
    'pt-BR':
      'O app de notas não tem desfazer. Os usuários perdem texto quando colam por cima de um parágrafo por engano. Cada edição deveria poder ser desfeita, e o histórico deveria ser visível para depurar.',
  },
  instructions: {
    en: 'Implement:\n- `InsertCommand(doc, text)` with `execute()` (appends `text` to `doc.content`) and `undo()` (removes it).\n- `Editor` with `run(command)` (executes and stores it), `undo()` (undoes the last one; with no history it does nothing) and `get history`, which returns `["insert <text>", …]`.',
    es: 'Implementá:\n- `InsertCommand(doc, text)` con `execute()` (agrega `text` al final de `doc.content`) y `undo()` (lo quita).\n- `Editor` con `run(command)` (ejecuta y guarda), `undo()` (deshace el último; sin historial no hace nada) y `get history`, que devuelve `["insert <text>", …]`.',
    'pt-BR':
      'Implemente:\n- `InsertCommand(doc, text)` com `execute()` (adiciona `text` ao final de `doc.content`) e `undo()` (remove).\n- `Editor` com `run(command)` (executa e guarda), `undo()` (desfaz o último; sem histórico não faz nada) e `get history`, que devolve `["insert <text>", …]`.',
  },
  starterCode: `class Editor {
  constructor(doc) {
    this.doc = doc;
  }

  type(text) {
    this.doc.content += text;
  }
}
`,
  tests: [
    {
      name: {
        en: 'runs edits and records them',
        es: 'ejecuta ediciones y las registra',
        'pt-BR': 'executa edições e as registra',
      },
      code: `const doc = { content: '' };
const editor = new Editor();
editor.run(new InsertCommand(doc, 'Hello'));
editor.run(new InsertCommand(doc, ' world'));
expect(doc.content).toBe('Hello world');
expect(editor.history).toEqual(['insert Hello', 'insert  world']);`,
    },
    {
      name: {
        en: 'undoes two edits and leaves the right text',
        es: 'deshace dos ediciones y deja el texto correcto',
        'pt-BR': 'desfaz duas edições e deixa o texto correto',
      },
      code: `const doc = { content: '' };
const editor = new Editor();
editor.run(new InsertCommand(doc, 'Ship it'));
editor.run(new InsertCommand(doc, ' today'));
editor.run(new InsertCommand(doc, '!!!'));
editor.undo();
editor.undo();
expect(doc.content).toBe('Ship it');
expect(editor.history).toEqual(['insert Ship it']);`,
    },
    {
      name: {
        en: 'undo with no history does nothing',
        es: 'deshacer sin historial no hace nada',
        'pt-BR': 'desfazer sem histórico não faz nada',
      },
      code: `const editor = new Editor();
editor.undo();
expect(editor.history).toEqual([]);`,
    },
    {
      name: {
        en: 'works with any command',
        es: 'funciona con cualquier comando',
        'pt-BR': 'funciona com qualquer comando',
      },
      code: `const execute = fn();
const undo = fn();
const editor = new Editor();
editor.run({ execute, undo, text: 'x' });
editor.undo();
expect(execute).toHaveBeenCalledTimes(1);
expect(undo).toHaveBeenCalledTimes(1);`,
    },
  ],
  checks: [
    {
      rule: 'requireMethod',
      className: 'InsertCommand',
      method: 'undo',
      message: {
        en: 'InsertCommand knows how to undo itself',
        es: 'InsertCommand sabe deshacerse',
        'pt-BR': 'InsertCommand sabe se desfazer',
      },
    },
  ],
  hints: {
    en: [
      'Each command stores everything it needs to run and revert: the document and the text.',
      '`Editor` just keeps a stack: `push` on run, `pop()?.undo()` on undo.',
    ],
    es: [
      'Cada comando guarda todo lo necesario para ejecutarse y revertirse: el documento y el texto.',
      '`Editor` solo mantiene una pila: `push` al ejecutar, `pop()?.undo()` al deshacer.',
    ],
    'pt-BR': [
      'Cada comando guarda tudo o que precisa para executar e reverter: o documento e o texto.',
      '`Editor` só mantém uma pilha: `push` ao executar, `pop()?.undo()` ao desfazer.',
    ],
  },
  solution: `class InsertCommand {
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

  run(command) {
    command.execute();
    this.#history.push(command);
  }

  undo() {
    this.#history.pop()?.undo();
  }

  get history() {
    return this.#history.map((c) => 'insert ' + c.text);
  }
}
`,
};
