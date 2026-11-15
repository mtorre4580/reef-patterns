import type { Pattern } from '../types';

export const mediator: Pattern = {
  id: 'mediator',
  rank: 31,
  name: 'Mediator',
  localName: { en: 'Mediator', es: 'Mediador', 'pt-BR': 'Mediador' },
  category: 'comportamiento',
  tier: 3,
  gof: true,
  summary: {
    en: 'A central object coordinates how several components interact, so they no longer talk to each other directly.',
    es: 'Un objeto central coordina cómo interactúan varios componentes, que ya no se hablan directamente entre sí.',
    'pt-BR':
      'Um objeto central coordena como vários componentes interagem, que deixam de se falar diretamente.',
  },
  when: {
    en: 'When many objects call each other in a web of dependencies and every change to one forces you to touch several others.',
    es: 'Cuando muchos objetos se llaman unos a otros formando una telaraña de dependencias y cada cambio en uno obliga a tocar a varios.',
    'pt-BR':
      'Quando muitos objetos se chamam formando uma teia de dependências e cada mudança em um obriga a mexer em vários.',
  },
  pros: {
    en: ['Coordination rules live in one place.', 'Components are independent and reusable.'],
    es: [
      'Las reglas de coordinación quedan en un solo lugar.',
      'Los componentes son independientes y reutilizables.',
    ],
    'pt-BR': [
      'As regras de coordenação ficam em um só lugar.',
      'Os componentes são independentes e reutilizáveis.',
    ],
  },
  cons: {
    en: [
      'The mediator can become a huge central object.',
      'One more hop to understand who reacts to what.',
    ],
    es: [
      'El mediador puede volverse un objeto enorme y central.',
      'Agrega un salto más para entender quién reacciona a qué.',
    ],
    'pt-BR': [
      'O mediador pode virar um objeto enorme e central.',
      'Adiciona um salto a mais para entender quem reage a quê.',
    ],
  },
  realWorld: {
    en: 'A form coordinating dependent fields, React\'s "lift state up", micro-frontend orchestrators, chat rooms.',
    es: 'Un formulario que coordina campos dependientes, el patrón “lift state up” de React, los orquestadores de micro-frontends, los chat rooms.',
    'pt-BR':
      'Um formulário que coordena campos dependentes, o "lift state up" do React, os orquestradores de micro-frontends, as salas de chat.',
  },
  example: {
    title: {
      en: 'Checkout form coordinator',
      es: 'Coordinador de un formulario de checkout',
      'pt-BR': 'Coordenador de um formulário de checkout',
    },
    scenario: {
      en: 'Changing the country updates the shipping options and the tax field; choosing pickup hides the address. The fields do not know each other: they tell the form mediator.',
      es: 'Cambiar el país actualiza las opciones de envío y el campo de impuestos; elegir retiro oculta la dirección. Los campos no se conocen: le avisan al mediador del formulario.',
      'pt-BR':
        'Mudar o país atualiza as opções de frete e o campo de impostos; escolher retirada esconde o endereço. Os campos não se conhecem: avisam o mediador do formulário.',
    },
    code: `class CheckoutFormMediator {
  fields = {};
  register(name, field) {
    this.fields[name] = field;
    field.mediator = this;
  }
  notify(sender, value) {
    const { shipping, tax, address } = this.fields;
    if (sender === 'country') {
      shipping.setOptions(value === 'AR' ? ['standard', 'pickup'] : ['standard', 'express']);
      tax.setVisible(value === 'AR');
    }
    if (sender === 'shipping') address.setVisible(value !== 'pickup');
  }
}

const field = (name) => ({
  name,
  visible: true,
  options: [],
  change(value) { this.mediator.notify(name, value); },
  setOptions(options) { this.options = options; },
  setVisible(visible) { this.visible = visible; },
});

const form = new CheckoutFormMediator();
for (const name of ['country', 'shipping', 'tax', 'address']) form.register(name, field(name));

form.fields.country.change('AR');
console.log(form.fields.shipping.options, form.fields.tax.visible); // ['standard', 'pickup'] true
form.fields.shipping.change('pickup');
console.log(form.fields.address.visible); // false`,
  },
  related: ['observer', 'facade', 'pub-sub'],
};
