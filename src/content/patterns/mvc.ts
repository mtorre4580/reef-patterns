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
      en: 'Water parameter panel',
      es: 'Panel de parámetros del agua',
      'pt-BR': 'Painel de parâmetros da água',
    },
    scenario: {
      en: 'The model stores readings and knows when a value is out of range; the view only builds text; the controller receives the reading the user enters.',
      es: 'El modelo guarda lecturas y sabe cuándo un valor está fuera de rango; la vista solo arma texto; el controlador recibe la lectura que carga el usuario.',
      'pt-BR':
        'O modelo guarda leituras e sabe quando um valor está fora da faixa; a visão só monta texto; o controlador recebe a leitura que o usuário digita.',
    },
    code: `class ParamsModel {
  #listeners = [];
  readings = {};
  ranges = { kh: [7, 9], ca: [400, 450], mg: [1250, 1400] };

  set(param, value) {
    this.readings[param] = value;
    this.#listeners.forEach((fn) => fn());
  }
  isOk(param) {
    const [min, max] = this.ranges[param];
    return this.readings[param] >= min && this.readings[param] <= max;
  }
  onChange(fn) {
    this.#listeners.push(fn);
  }
}

const ParamsView = {
  render(model) {
    return Object.keys(model.readings)
      .map((p) => (model.isOk(p) ? '✓ ' : '✗ ') + p.toUpperCase() + ' ' + model.readings[p])
      .join('\\n');
  },
};

class ParamsController {
  constructor(model, view, output) {
    this.model = model;
    model.onChange(() => output(view.render(model)));
  }
  submitReading(param, raw) {
    const value = Number(raw);
    if (Number.isNaN(value)) throw new Error('Enter a number');
    this.model.set(param, value);
  }
}

const controller = new ParamsController(new ParamsModel(), ParamsView, console.log);
controller.submitReading('kh', '8.3');
controller.submitReading('ca', '380');`,
  },
  related: ['mvvm', 'container-presentational', 'observer'],
};
