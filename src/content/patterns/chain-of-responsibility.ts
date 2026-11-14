import type { Pattern } from '../types';

export const chainOfResponsibility: Pattern = {
  id: 'chain-of-responsibility',
  rank: 19,
  name: 'Chain of Responsibility',
  localName: {
    en: 'Chain of Responsibility',
    es: 'Cadena de responsabilidad',
    'pt-BR': 'Cadeia de responsabilidade',
  },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'Passes a request along a chain of handlers; each one decides whether to handle it, transform it or pass it on.',
    es: 'Pasa una solicitud por una cadena de manejadores; cada uno decide si la atiende, la transforma o la pasa al siguiente.',
    'pt-BR':
      'Passa uma solicitação por uma cadeia de manipuladores; cada um decide se a atende, a transforma ou a passa adiante.',
  },
  when: {
    en: "When several handlers could answer a request based on changing rules and you don't want one giant if that knows them all.",
    es: 'Cuando varios manejadores podrían responder a un pedido según reglas que cambian, y no querés un if gigante que conozca a todos.',
    'pt-BR':
      'Quando vários manipuladores poderiam responder a um pedido segundo regras que mudam, e você não quer um if gigante que conheça todos.',
  },
  pros: {
    en: [
      'Adding, removing or reordering handlers is trivial.',
      'Each handler has a single responsibility.',
    ],
    es: [
      'Agregar, quitar o reordenar manejadores es trivial.',
      'Cada manejador tiene una única responsabilidad.',
    ],
    'pt-BR': [
      'Adicionar, remover ou reordenar manipuladores é trivial.',
      'Cada manipulador tem uma única responsabilidade.',
    ],
  },
  cons: {
    en: [
      'A request can reach the end without anyone handling it.',
      'Debugging long chains means following every link.',
    ],
    es: [
      'Un pedido puede llegar al final sin que nadie lo atienda.',
      'Depurar cadenas largas exige seguir cada eslabón.',
    ],
    'pt-BR': [
      'Um pedido pode chegar ao fim sem que ninguém o atenda.',
      'Depurar cadeias longas exige seguir cada elo.',
    ],
  },
  realWorld: {
    en: 'Express and Koa middlewares, axios interceptors, DOM event propagation, React error boundaries.',
    es: 'Los middlewares de Express y Koa, los interceptores de axios, la propagación de eventos del DOM, los error boundaries de React.',
    'pt-BR':
      'Os middlewares do Express e do Koa, os interceptors do axios, a propagação de eventos do DOM, os error boundaries do React.',
  },
  example: {
    title: {
      en: 'Tiered temperature alarms',
      es: 'Alarmas de temperatura escalonadas',
      'pt-BR': 'Alarmes de temperatura escalonados',
    },
    scenario: {
      en: 'A high reading goes through three levels: at 27.5 °C it only warns, at 29 °C it alerts the phone and at 30.5 °C it turns off the lighting so the water stops heating up.',
      es: 'Una lectura alta pasa por tres niveles: a 27,5 °C solo se avisa, a 29 °C se alerta al celular y a 30,5 °C se apaga la iluminación para que el agua no siga calentándose.',
      'pt-BR':
        'Uma leitura alta passa por três níveis: a 27,5 °C só avisa, a 29 °C alerta o celular e a 30,5 °C desliga a iluminação para a água parar de esquentar.',
    },
    code: `class AlarmHandler {
  setNext(handler) {
    this.next = handler;
    return handler; // allows chaining: a.setNext(b).setNext(c)
  }
  handle(celsius) {
    return this.next ? this.next.handle(celsius) : 'Normal temperature';
  }
}

class Shutdown extends AlarmHandler {
  handle(c) {
    return c >= 30.5 ? 'Turning off the lights (' + c + ' °C)' : super.handle(c);
  }
}
class PhoneAlert extends AlarmHandler {
  handle(c) {
    return c >= 29 ? 'Alert sent to the phone (' + c + ' °C)' : super.handle(c);
  }
}
class Notice extends AlarmHandler {
  handle(c) {
    return c >= 27.5 ? 'Notice on the panel (' + c + ' °C)' : super.handle(c);
  }
}

// The most severe goes first
const chain = new Shutdown();
chain.setNext(new PhoneAlert()).setNext(new Notice());

console.log(chain.handle(26)); // Normal temperature
console.log(chain.handle(28)); // Notice on the panel
console.log(chain.handle(31)); // Turning off the lights`,
  },
  related: ['middleware', 'command', 'decorator'],
};
