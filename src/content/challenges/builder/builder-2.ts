import type { Challenge } from '../../types';

export const builder2: Challenge = {
  id: 'builder-2',
  patternId: 'builder',
  title: {
    en: 'Transactional email builder',
    es: 'Builder de emails transaccionales',
    'pt-BR': 'Builder de emails transacionais',
  },
  difficulty: 'facil',
  story: {
    en: 'Transactional emails are built with an object literal of many fields. Some were sent without a recipient, and one subject was so long that the provider rejected it.',
    es: 'Los emails transaccionales se arman con un objeto literal de muchos campos. Algunos salieron sin destinatario, y un asunto era tan largo que el proveedor lo rechazó.',
    'pt-BR':
      'Os emails transacionais são montados com um objeto literal de muitos campos. Alguns saíram sem destinatário, e um assunto era tão longo que o provedor o rejeitou.',
  },
  instructions: {
    en: 'Implement `EmailBuilder` with `to(address)`, `cc(address)` (can be called several times), `subject(text)` and `body(text)`, all chainable, and a `build()` that:\n- requires `to` (if missing, `Error("Missing recipient")`);\n- requires a subject of at most 120 characters (otherwise `RangeError("Invalid subject")`);\n- returns `{ to, cc, subject, body }` with `cc` as an array (`[]` by default) and `body` as `""` by default.',
    es: 'Implementá `EmailBuilder` con `to(address)`, `cc(address)` (se puede llamar varias veces), `subject(text)` y `body(text)`, todos encadenables, y un `build()` que:\n- exige `to` (si falta, `Error("Missing recipient")`);\n- exige un asunto de como mucho 120 caracteres (si no, `RangeError("Invalid subject")`);\n- devuelve `{ to, cc, subject, body }` con `cc` como array (`[]` por defecto) y `body` como `""` por defecto.',
    'pt-BR':
      'Implemente `EmailBuilder` com `to(address)`, `cc(address)` (pode ser chamado várias vezes), `subject(text)` e `body(text)`, todos encadeáveis, e um `build()` que:\n- exige `to` (se faltar, `Error("Missing recipient")`);\n- exige um assunto de no máximo 120 caracteres (senão, `RangeError("Invalid subject")`);\n- devolve `{ to, cc, subject, body }` com `cc` como array (`[]` por padrão) e `body` como `""` por padrão.',
  },
  starterCode: `function email(to, subject, body) {
  return { to, subject, body };
}
`,
  tests: [
    {
      name: {
        en: 'uses default values',
        es: 'usa valores por defecto',
        'pt-BR': 'usa valores padrão',
      },
      code: `expect(new EmailBuilder().to('ana@example.com').subject('Welcome').build()).toEqual({
  to: 'ana@example.com', cc: [], subject: 'Welcome', body: '',
});`,
    },
    {
      name: {
        en: 'accepts several cc and a body',
        es: 'acepta varios cc y un cuerpo',
        'pt-BR': 'aceita vários cc e um corpo',
      },
      code: `const mail = new EmailBuilder().to('ana@example.com').cc('ops@example.com').cc('billing@example.com').subject('Invoice').body('Attached').build();
expect(mail.cc).toEqual(['ops@example.com', 'billing@example.com']);
expect(mail.body).toBe('Attached');`,
    },
    {
      name: {
        en: 'requires a recipient',
        es: 'exige un destinatario',
        'pt-BR': 'exige um destinatário',
      },
      code: `expect(() => new EmailBuilder().subject('Hi').build()).toThrow('Missing recipient');`,
    },
    {
      name: { en: 'validates the subject', es: 'valida el asunto', 'pt-BR': 'valida o assunto' },
      code: `expect(() => new EmailBuilder().to('a@b.com').build()).toThrow('Invalid subject');
expect(() => new EmailBuilder().to('a@b.com').subject('x'.repeat(121)).build()).toThrow('Invalid subject');`,
    },
  ],
  hints: {
    en: [
      'Store each value in a field and return `this`.',
      'Validate everything together in `build()` and copy the `cc` array.',
    ],
    es: [
      'Guardá cada valor en un campo y devolvé `this`.',
      'Validá todo junto en `build()` y copiá el array de `cc`.',
    ],
    'pt-BR': [
      'Guarde cada valor em um campo e devolva `this`.',
      'Valide tudo junto em `build()` e copie o array de `cc`.',
    ],
  },
  solution: `class EmailBuilder {
  #to = null;
  #cc = [];
  #subject = '';
  #body = '';

  to(address) {
    this.#to = address;
    return this;
  }
  cc(address) {
    this.#cc.push(address);
    return this;
  }
  subject(text) {
    this.#subject = text;
    return this;
  }
  body(text) {
    this.#body = text;
    return this;
  }

  build() {
    if (!this.#to) throw new Error('Missing recipient');
    if (!this.#subject || this.#subject.length > 120) throw new RangeError('Invalid subject');
    return { to: this.#to, cc: [...this.#cc], subject: this.#subject, body: this.#body };
  }
}
`,
};
