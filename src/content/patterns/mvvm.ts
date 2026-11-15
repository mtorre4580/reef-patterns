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
      en: 'ViewModel for a signup form',
      es: 'ViewModel de un formulario de registro',
      'pt-BR': 'ViewModel de um formulário de cadastro',
    },
    scenario: {
      en: 'The signup view only shows inputs, errors and a button. The ViewModel turns raw field values into error messages, a "can submit" flag and a submit command.',
      es: 'La vista de registro solo muestra inputs, errores y un botón. El ViewModel transforma los valores crudos en mensajes de error, un "se puede enviar" y un comando de envío.',
      'pt-BR':
        'A visão de cadastro só mostra inputs, erros e um botão. O ViewModel transforma os valores crus em mensagens de erro, um "pode enviar" e um comando de envio.',
    },
    code: `// Model: raw data and the API
const model = { email: '', password: '', api: { register: (data) => ({ ok: true, ...data }) } };

function createSignupViewModel(model, onChange) {
  return {
    // State ready to display: the view computes nothing
    get errors() {
      return {
        email: model.email.includes('@') ? null : 'Enter a valid email',
        password: model.password.length >= 8 ? null : 'At least 8 characters',
      };
    },
    get canSubmit() {
      return Object.values(this.errors).every((e) => e === null);
    },
    // Commands the view binds to inputs and the button
    setField(name, value) {
      model[name] = value;
      onChange();
    },
    submit() {
      return this.canSubmit ? model.api.register({ email: model.email }) : null;
    },
  };
}

const vm = createSignupViewModel(model, () => console.log('re-render'));
vm.setField('email', 'ana@example.com');
console.log(vm.errors, vm.canSubmit); // password still too short
vm.setField('password', 'correct-horse');
console.log(vm.submit());`,
  },
  related: ['mvc', 'custom-hooks', 'observer'],
};
