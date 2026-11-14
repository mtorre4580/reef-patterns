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
    title: { en: 'Sump coordinator', es: 'Coordinador del sump', 'pt-BR': 'Coordenador do sump' },
    scenario: {
      en: 'If the level sensor detects low water, the ATO refills; if the skimmer overflows, it shuts down and the ATO pauses. No device knows the others: they tell the coordinator.',
      es: 'Si el sensor de nivel detecta agua baja, el ATO repone; si el skimmer desborda, se apaga y se pausa el ATO. Ningún equipo conoce a los demás: le avisan al coordinador.',
      'pt-BR':
        'Se o sensor de nível detecta água baixa, o ATO repõe; se o skimmer transborda, ele desliga e o ATO pausa. Nenhum equipamento conhece os outros: eles avisam o coordenador.',
    },
    code: `class SumpMediator {
  constructor() {
    this.devices = {};
  }
  register(name, device) {
    this.devices[name] = device;
    device.mediator = this;
  }
  notify(sender, event) {
    const { ato, skimmer } = this.devices;
    if (event === 'low-level') ato.start();
    if (event === 'level-ok') ato.stop();
    if (event === 'overflow') {
      skimmer.stop();
      ato.stop();
    }
    console.log(sender + ': ' + event);
  }
}

const levelSensor = {
  read(cm) {
    this.mediator.notify('sensor', cm < 18 ? 'low-level' : 'level-ok');
  },
};
const skimmer = { running: true, stop() { this.running = false; }, overflow() { this.mediator.notify('skimmer', 'overflow'); } };
const ato = { running: false, start() { this.running = true; }, stop() { this.running = false; } };

const sump = new SumpMediator();
sump.register('sensor', levelSensor);
sump.register('skimmer', skimmer);
sump.register('ato', ato);

levelSensor.read(15);
console.log(ato.running); // true
skimmer.overflow();
console.log(ato.running, skimmer.running); // false false`,
  },
  related: ['observer', 'facade', 'pub-sub'],
};
