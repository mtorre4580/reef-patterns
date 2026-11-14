import type { Pattern } from '../types';

export const mediator: Pattern = {
  id: 'mediator',
  rank: 31,
  name: 'Mediator',
  nameEs: 'Mediador',
  category: 'comportamiento',
  tier: 3,
  gof: true,
  summary:
    'Un objeto central coordina cómo interactúan varios componentes, que ya no se hablan directamente entre sí.',
  when: 'Cuando muchos objetos se llaman unos a otros formando una telaraña de dependencias y cada cambio en uno obliga a tocar a varios.',
  pros: [
    'Las reglas de coordinación quedan en un solo lugar.',
    'Los componentes son independientes y reutilizables.',
  ],
  cons: [
    'El mediador puede volverse un objeto enorme y central.',
    'Agrega un salto más para entender quién reacciona a qué.',
  ],
  realWorld:
    'Un formulario que coordina campos dependientes, el patrón “lift state up” de React, los orquestadores de micro-frontends, los chat rooms.',
  example: {
    title: 'Coordinador del sump',
    scenario:
      'Si el sensor de nivel detecta agua baja, el ATO repone; si el skimmer desborda, se apaga y se pausa el ATO. Ningún equipo conoce a los demás: le avisan al coordinador.',
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
    if (event === 'nivel-bajo') ato.start();
    if (event === 'nivel-ok') ato.stop();
    if (event === 'desborde') {
      skimmer.stop();
      ato.stop();
    }
    console.log(sender + ': ' + event);
  }
}

const levelSensor = {
  read(cm) {
    this.mediator.notify('sensor', cm < 18 ? 'nivel-bajo' : 'nivel-ok');
  },
};
const skimmer = { running: true, stop() { this.running = false; }, overflow() { this.mediator.notify('skimmer', 'desborde'); } };
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
