import type { Pattern } from '../types';

export const mvc: Pattern = {
  id: 'mvc',
  rank: 16,
  name: 'MVC',
  nameEs: 'Modelo-Vista-Controlador',
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary:
    'Separa los datos (modelo), su presentación (vista) y la lógica que traduce acciones del usuario (controlador).',
  when: 'Cuando una pantalla mezcla reglas de negocio, formato y manejo de eventos, y querés poder cambiar uno sin romper los otros.',
  pros: [
    'Responsabilidades claras y testeables por separado.',
    'Varias vistas pueden mostrar el mismo modelo.',
  ],
  cons: [
    'En apps chicas, tres capas son demasiada ceremonia.',
    'El controlador tiende a engordar con lógica que debería estar en el modelo.',
  ],
  realWorld:
    'Ruby on Rails, Express con plantillas, Backbone.js, ASP.NET MVC; en frontend moderno inspiró la separación entre stores y componentes.',
  example: {
    title: 'Panel de parámetros del agua',
    scenario:
      'El modelo guarda lecturas y sabe cuándo un valor está fuera de rango; la vista solo arma texto; el controlador recibe la lectura que carga el usuario.',
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
    if (Number.isNaN(value)) throw new Error('Ingresá un número');
    this.model.set(param, value);
  }
}

const controller = new ParamsController(new ParamsModel(), ParamsView, console.log);
controller.submitReading('kh', '8.3');
controller.submitReading('ca', '380');`,
  },
  related: ['mvvm', 'container-presentational', 'observer'],
};
