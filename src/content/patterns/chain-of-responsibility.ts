import type { Pattern } from '../types';

export const chainOfResponsibility: Pattern = {
  id: 'chain-of-responsibility',
  rank: 19,
  name: 'Chain of Responsibility',
  nameEs: 'Cadena de responsabilidad',
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary:
    'Pasa una solicitud por una cadena de manejadores; cada uno decide si la atiende, la transforma o la pasa al siguiente.',
  when: 'Cuando varios manejadores podrían responder a un pedido según reglas que cambian, y no querés un if gigante que conozca a todos.',
  pros: [
    'Agregar, quitar o reordenar manejadores es trivial.',
    'Cada manejador tiene una única responsabilidad.',
  ],
  cons: [
    'Un pedido puede llegar al final sin que nadie lo atienda.',
    'Depurar cadenas largas exige seguir cada eslabón.',
  ],
  realWorld:
    'Los middlewares de Express y Koa, los interceptores de axios, la propagación de eventos del DOM, los error boundaries de React.',
  example: {
    title: 'Alarmas de temperatura escalonadas',
    scenario:
      'Una lectura alta pasa por tres niveles: a 27,5 °C solo se avisa, a 29 °C se alerta al celular y a 30,5 °C se apaga la iluminación para que el agua no siga calentándose.',
    code: `class AlarmHandler {
  setNext(handler) {
    this.next = handler;
    return handler; // permite encadenar: a.setNext(b).setNext(c)
  }
  handle(celsius) {
    return this.next ? this.next.handle(celsius) : 'Temperatura normal';
  }
}

class Shutdown extends AlarmHandler {
  handle(c) {
    return c >= 30.5 ? 'Apagando iluminación (' + c + ' °C)' : super.handle(c);
  }
}
class PhoneAlert extends AlarmHandler {
  handle(c) {
    return c >= 29 ? 'Alerta enviada al celular (' + c + ' °C)' : super.handle(c);
  }
}
class Notice extends AlarmHandler {
  handle(c) {
    return c >= 27.5 ? 'Aviso en el panel (' + c + ' °C)' : super.handle(c);
  }
}

// El más grave va primero
const chain = new Shutdown();
chain.setNext(new PhoneAlert()).setNext(new Notice());

console.log(chain.handle(26)); // Temperatura normal
console.log(chain.handle(28)); // Aviso en el panel
console.log(chain.handle(31)); // Apagando iluminación`,
  },
  related: ['middleware', 'command', 'decorator'],
};
