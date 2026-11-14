import type { Pattern } from '../types';

export const facade: Pattern = {
  id: 'facade',
  rank: 7,
  name: 'Facade',
  nameEs: 'Fachada',
  category: 'estructural',
  tier: 1,
  gof: true,
  summary: 'Ofrece una interfaz simple que coordina un subsistema complejo de varias piezas.',
  when: 'Cuando una tarea común exige llamar a varios objetos en un orden preciso y querés que el resto del código lo haga con una sola llamada.',
  pros: [
    'Simplifica el uso del subsistema y reduce errores de orden.',
    'Reduce el acoplamiento: el cliente depende de la fachada, no de cada pieza.',
  ],
  cons: [
    'Puede crecer hasta volverse un “objeto dios”.',
    'Oculta opciones avanzadas que algunos clientes necesitan.',
  ],
  realWorld:
    'jQuery sobre el DOM, fetch sobre XHR y streams, los SDK de servicios (Stripe, Firebase) que esconden decenas de endpoints.',
  example: {
    title: 'Modo mantenimiento del acuario',
    scenario:
      'Para limpiar el vidrio hay que apagar la bomba de retorno, el skimmer y el ATO en ese orden, y al terminar restaurarlos en el orden inverso. Nadie debería recordar la secuencia.',
    code: `const returnPump = { on: true, stop() { this.on = false; }, start() { this.on = true; } };
const skimmer = { on: true, stop() { this.on = false; }, start() { this.on = true; } };
const ato = { on: true, stop() { this.on = false; }, start() { this.on = true; } };

class TankFacade {
  #saved = null;

  constructor(devices) {
    this.devices = devices; // orden de apagado
  }

  maintenanceMode() {
    this.#saved = this.devices.map((d) => d.on);
    for (const device of this.devices) device.stop();
  }

  resume() {
    // Restauramos al revés: primero el retorno, último el ATO
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
