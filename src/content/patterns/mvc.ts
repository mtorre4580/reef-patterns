import type { Pattern } from '../types';

export const mvc: Pattern = {
  id: 'mvc',
  rank: 16,
  name: 'MVC',
  localName: { en: 'MVC', es: 'Modelo-Vista-Controlador', 'pt-BR': 'Modelo-Visão-Controlador' },
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary: {
    en: 'Separates the data (model), its presentation (view) and the logic that translates user actions (controller).',
    es: 'Separa los datos (modelo), su presentación (vista) y la lógica que traduce acciones del usuario (controlador).',
    'pt-BR':
      'Separa os dados (modelo), sua apresentação (visão) e a lógica que traduz as ações do usuário (controlador).',
  },
  when: {
    en: 'When a screen mixes business rules, formatting and event handling, and you want to change one without breaking the others.',
    es: 'Cuando una pantalla mezcla reglas de negocio, formato y manejo de eventos, y querés poder cambiar uno sin romper los otros.',
    'pt-BR':
      'Quando uma tela mistura regras de negócio, formatação e tratamento de eventos e você quer poder mudar um sem quebrar os outros.',
  },
  pros: {
    en: [
      'Clear responsibilities that can be tested separately.',
      'Several views can show the same model.',
    ],
    es: [
      'Responsabilidades claras y testeables por separado.',
      'Varias vistas pueden mostrar el mismo modelo.',
    ],
    'pt-BR': [
      'Responsabilidades claras e testáveis separadamente.',
      'Várias visões podem mostrar o mesmo modelo.',
    ],
  },
  cons: {
    en: [
      'In small apps, three layers are too much ceremony.',
      'The controller tends to grow logic that belongs in the model.',
    ],
    es: [
      'En apps chicas, tres capas son demasiada ceremonia.',
      'El controlador tiende a engordar con lógica que debería estar en el modelo.',
    ],
    'pt-BR': [
      'Em apps pequenos, três camadas são cerimônia demais.',
      'O controlador tende a engordar com lógica que deveria estar no modelo.',
    ],
  },
  realWorld: {
    en: 'Ruby on Rails, Express with templates, Backbone.js, ASP.NET MVC; in modern frontend it inspired the split between stores and components.',
    es: 'Ruby on Rails, Express con plantillas, Backbone.js, ASP.NET MVC; en frontend moderno inspiró la separación entre stores y componentes.',
    'pt-BR':
      'Ruby on Rails, Express com templates, Backbone.js, ASP.NET MVC; no frontend moderno inspirou a separação entre stores e componentes.',
  },
  example: {
    title: {
      en: 'Todo list with MVC',
      es: 'Lista de tareas con MVC',
      'pt-BR': 'Lista de tarefas com MVC',
    },
    scenario: {
      en: 'The model stores tasks and knows which ones are overdue; the view only builds text; the controller receives what the user types.',
      es: 'El modelo guarda tareas y sabe cuáles están vencidas; la vista solo arma texto; el controlador recibe lo que escribe el usuario.',
      'pt-BR':
        'O modelo guarda tarefas e sabe quais estão atrasadas; a visão só monta texto; o controlador recebe o que o usuário digita.',
    },
    code: `class TodoModel {
  #listeners = [];
  todos = [];

  add(title, due) {
    this.todos.push({ title, due });
    this.#listeners.forEach((fn) => fn());
  }
  isOverdue(todo, today) {
    return todo.due < today;
  }
  onChange(fn) {
    this.#listeners.push(fn);
  }
}

const TodoView = {
  render(model, today) {
    return model.todos
      .map((t) => (model.isOverdue(t, today) ? '! ' : '- ') + t.title + ' (' + t.due + ')')
      .join('\\n');
  },
};

class TodoController {
  constructor(model, view, output, today) {
    this.model = model;
    model.onChange(() => output(view.render(model, today)));
  }
  submit(rawTitle, due) {
    const title = rawTitle.trim();
    if (!title) throw new Error('The title is required');
    this.model.add(title, due);
  }
}

const controller = new TodoController(new TodoModel(), TodoView, console.log, '2026-03-10');
controller.submit('Renew SSL certificate', '2026-03-01');
controller.submit('  Ship v2.4  ', '2026-03-20');`,
  },
  related: ['mvvm', 'container-presentational', 'observer'],
};
