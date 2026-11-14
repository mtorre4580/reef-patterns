import type { Pattern } from '../types';

export const mvvm: Pattern = {
  id: 'mvvm',
  rank: 17,
  name: 'MVVM',
  localName: { en: 'MVVM', es: 'Modelo-Vista-VistaModelo', 'pt-BR': 'Modelo-Visão-VisãoModelo' },
  category: 'arquitectura',
  tier: 2,
  gof: false,
  summary: {
    en: 'A ViewModel exposes state and commands ready for the view, which binds to them declaratively.',
    es: 'Un ViewModel expone estado y comandos listos para la vista, que se enlaza a ellos de forma declarativa.',
    'pt-BR':
      'Um ViewModel expõe estado e comandos prontos para a visão, que se liga a eles de forma declarativa.',
  },
  when: {
    en: 'When the view updates through data binding and you want all presentation logic (formatting, validation, derived state) to be testable without a UI.',
    es: 'Cuando la vista se actualiza por data binding y querés que toda la lógica de presentación (formatos, validaciones, estados derivados) sea testeable sin UI.',
    'pt-BR':
      'Quando a visão se atualiza por data binding e você quer que toda a lógica de apresentação (formatos, validações, estados derivados) seja testável sem UI.',
  },
  pros: {
    en: [
      'Presentation logic is tested without rendering anything.',
      'The view stays declarative with almost no code.',
      'Fits reactive frameworks.',
    ],
    es: [
      'La lógica de presentación se testea sin renderizar nada.',
      'La vista queda declarativa y casi sin código.',
      'Encaja con frameworks reactivos.',
    ],
    'pt-BR': [
      'A lógica de apresentação é testada sem renderizar nada.',
      'A visão fica declarativa e quase sem código.',
      'Combina com frameworks reativos.',
    ],
  },
  cons: {
    en: [
      'Two-way binding can cause updates that are hard to trace.',
      'For simple screens, the ViewModel is an extra layer.',
    ],
    es: [
      'El binding bidireccional puede generar actualizaciones difíciles de rastrear.',
      'Para pantallas simples, el ViewModel es una capa extra.',
    ],
    'pt-BR': [
      'O binding bidirecional pode gerar atualizações difíceis de rastrear.',
      'Para telas simples, o ViewModel é uma camada a mais.',
    ],
  },
  realWorld: {
    en: "Knockout.js, Vue's Options/Composition API, Android Jetpack ViewModels; a React hook returning derived state and handlers plays the same role.",
    es: 'Knockout.js, la Options/Composition API de Vue, los ViewModels de Android Jetpack; un hook de React que devuelve estado derivado y handlers cumple el mismo rol.',
    'pt-BR':
      'Knockout.js, a Options/Composition API do Vue, os ViewModels do Android Jetpack; um hook do React que devolve estado derivado e handlers cumpre o mesmo papel.',
  },
  example: {
    title: {
      en: 'ViewModel for the parameter panel',
      es: 'ViewModel del panel de parámetros',
      'pt-BR': 'ViewModel do painel de parâmetros',
    },
    scenario: {
      en: 'The panel view only shows text and colors. The ViewModel turns the raw model readings into labels, statuses and a command to log a new one.',
      es: 'La vista del panel solo muestra textos y colores. El ViewModel transforma las lecturas crudas del modelo en etiquetas, estados y un comando para registrar una nueva.',
      'pt-BR':
        'A visão do painel só mostra textos e cores. O ViewModel transforma as leituras cruas do modelo em rótulos, estados e um comando para registrar uma nova.',
    },
    code: `// Model: domain data and rules
const model = {
  readings: [{ param: 'kh', value: 6.4 }, { param: 'ca', value: 420 }],
  ranges: { kh: [7, 9], ca: [400, 450] },
};

function createParamsViewModel(model, onChange) {
  const statusOf = ({ param, value }) => {
    const [min, max] = model.ranges[param];
    return value < min ? 'low' : value > max ? 'high' : 'ok';
  };

  return {
    // State ready to display: the view computes nothing
    get rows() {
      return model.readings.map((r) => ({
        label: r.param.toUpperCase(),
        text: r.value + (r.param === 'kh' ? ' dKH' : ' ppm'),
        status: statusOf(r),
      }));
    },
    get alerts() {
      return this.rows.filter((r) => r.status !== 'ok').length;
    },
    // Command the view binds to a button
    addReading(param, value) {
      model.readings.push({ param, value: Number(value) });
      onChange();
    },
  };
}

const vm = createParamsViewModel(model, () => console.log('Re-render'));
console.log(vm.rows, vm.alerts); // 1 alert: low KH
vm.addReading('kh', '7.8');`,
  },
  related: ['mvc', 'custom-hooks', 'observer'],
};
