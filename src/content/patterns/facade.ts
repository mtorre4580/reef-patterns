import type { Pattern } from '../types';

export const facade: Pattern = {
  id: 'facade',
  rank: 7,
  name: 'Facade',
  localName: { en: 'Facade', es: 'Fachada', 'pt-BR': 'Fachada' },
  category: 'estructural',
  tier: 1,
  gof: true,
  summary: {
    en: 'Provides a simple interface that coordinates a complex subsystem made of several parts.',
    es: 'Ofrece una interfaz simple que coordina un subsistema complejo de varias piezas.',
    'pt-BR': 'Oferece uma interface simples que coordena um subsistema complexo de várias peças.',
  },
  when: {
    en: 'When a common task requires calling several objects in a precise order and you want the rest of the code to do it with a single call.',
    es: 'Cuando una tarea común exige llamar a varios objetos en un orden preciso y querés que el resto del código lo haga con una sola llamada.',
    'pt-BR':
      'Quando uma tarefa comum exige chamar vários objetos em uma ordem precisa e você quer que o resto do código faça isso com uma única chamada.',
  },
  pros: {
    en: [
      'Simplifies using the subsystem and reduces ordering mistakes.',
      'Reduces coupling: the client depends on the facade, not on each part.',
    ],
    es: [
      'Simplifica el uso del subsistema y reduce errores de orden.',
      'Reduce el acoplamiento: el cliente depende de la fachada, no de cada pieza.',
    ],
    'pt-BR': [
      'Simplifica o uso do subsistema e reduz erros de ordem.',
      'Reduz o acoplamento: o cliente depende da fachada, não de cada peça.',
    ],
  },
  cons: {
    en: ['It can grow into a "god object".', 'It hides advanced options that some clients need.'],
    es: [
      'Puede crecer hasta volverse un “objeto dios”.',
      'Oculta opciones avanzadas que algunos clientes necesitan.',
    ],
    'pt-BR': [
      'Pode crescer até virar um "objeto deus".',
      'Esconde opções avançadas de que alguns clientes precisam.',
    ],
  },
  realWorld: {
    en: 'jQuery over the DOM, fetch over XHR and streams, service SDKs (Stripe, Firebase) that hide dozens of endpoints.',
    es: 'jQuery sobre el DOM, fetch sobre XHR y streams, los SDK de servicios (Stripe, Firebase) que esconden decenas de endpoints.',
    'pt-BR':
      'jQuery sobre o DOM, fetch sobre XHR e streams, os SDKs de serviços (Stripe, Firebase) que escondem dezenas de endpoints.',
  },
  example: {
    title: {
      en: 'Tank maintenance mode',
      es: 'Modo mantenimiento del acuario',
      'pt-BR': 'Modo manutenção do aquário',
    },
    scenario: {
      en: 'To clean the glass you must turn off the return pump, the skimmer and the ATO in that order, and restore them in reverse order afterwards. Nobody should have to remember the sequence.',
      es: 'Para limpiar el vidrio hay que apagar la bomba de retorno, el skimmer y el ATO en ese orden, y al terminar restaurarlos en el orden inverso. Nadie debería recordar la secuencia.',
      'pt-BR':
        'Para limpar o vidro é preciso desligar a bomba de retorno, o skimmer e o ATO nessa ordem e, ao terminar, religá-los na ordem inversa. Ninguém deveria precisar lembrar a sequência.',
    },
    code: `const returnPump = { on: true, stop() { this.on = false; }, start() { this.on = true; } };
const skimmer = { on: true, stop() { this.on = false; }, start() { this.on = true; } };
const ato = { on: true, stop() { this.on = false; }, start() { this.on = true; } };

class TankFacade {
  #saved = null;

  constructor(devices) {
    this.devices = devices; // shutdown order
  }

  maintenanceMode() {
    this.#saved = this.devices.map((d) => d.on);
    for (const device of this.devices) device.stop();
  }

  resume() {
    // Restore in reverse: return pump first, ATO last
    [...this.devices].reverse().forEach((device, i, list) => {
      if (this.#saved[list.length - 1 - i]) device.start();
    });
    this.#saved = null;
  }
}

const tank = new TankFacade([ato, skimmer, returnPump]);
tank.maintenanceMode();
console.log(returnPump.on, skimmer.on, ato.on); // false false false
tank.resume();
console.log(returnPump.on, skimmer.on, ato.on); // true true true`,
  },
  related: ['adapter', 'mediator', 'module'],
};
