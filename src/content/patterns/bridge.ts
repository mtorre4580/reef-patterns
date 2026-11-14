import type { Pattern } from '../types';

export const bridge: Pattern = {
  id: 'bridge',
  rank: 40,
  name: 'Bridge',
  localName: { en: 'Bridge', es: 'Puente', 'pt-BR': 'Ponte' },
  category: 'estructural',
  tier: 3,
  gof: true,
  summary: {
    en: 'Separates an abstraction from its implementation so both can vary independently.',
    es: 'Separa una abstracción de su implementación para que ambas varíen de forma independiente.',
    'pt-BR':
      'Separa uma abstração da sua implementação para que ambas variem de forma independente.',
  },
  when: {
    en: 'When you have two dimensions that change separately (what it does and where it does it) and inheritance would force one class per combination.',
    es: 'Cuando tenés dos dimensiones que cambian por separado (qué hace y en qué plataforma lo hace) y la herencia te obligaría a una clase por cada combinación.',
    'pt-BR':
      'Quando você tem duas dimensões que mudam separadamente (o que faz e em que plataforma faz) e a herança obrigaria a uma classe por combinação.',
  },
  pros: {
    en: [
      'Avoids the M × N subclass explosion.',
      'Abstractions and implementations evolve separately.',
    ],
    es: [
      'Evita la explosión de subclases M × N.',
      'Abstracciones e implementaciones evolucionan por separado.',
    ],
    'pt-BR': [
      'Evita a explosão de subclasses M × N.',
      'Abstrações e implementações evoluem separadamente.',
    ],
  },
  cons: {
    en: [
      'Harder to understand than a simple hierarchy.',
      'Designing it upfront without two real dimensions is overengineering.',
    ],
    es: [
      'Más difícil de entender que una jerarquía simple.',
      'Diseñarlo de antemano sin dos dimensiones reales es sobreingeniería.',
    ],
    'pt-BR': [
      'Mais difícil de entender que uma hierarquia simples.',
      'Projetá-lo de antemão sem duas dimensões reais é exagero.',
    ],
  },
  realWorld: {
    en: "React's renderers (DOM, Native, Three.js) under the same component API, Knex drivers, winston transports.",
    es: 'Los renderers de React (DOM, Native, Three.js) bajo la misma API de componentes, los drivers de Knex, los transportes de winston.',
    'pt-BR':
      'Os renderers do React (DOM, Native, Three.js) sob a mesma API de componentes, os drivers do Knex, os transports do winston.',
  },
  example: {
    title: {
      en: 'Alerts over different channels',
      es: 'Alertas por distintos canales',
      'pt-BR': 'Alertas por canais diferentes',
    },
    scenario: {
      en: 'There are different kinds of alerts (informational, urgent) and delivery channels (phone, email, siren). Any alert can go out over any channel.',
      es: 'Hay alertas de distintos tipos (informativa, urgente) y canales de envío (celular, email, sirena). Cualquier alerta puede salir por cualquier canal.',
      'pt-BR':
        'Há alertas de tipos diferentes (informativo, urgente) e canais de envio (celular, email, sirene). Qualquer alerta pode sair por qualquer canal.',
    },
    code: `// Implementations: how it is sent
const phoneChannel = { deliver: (text) => 'Push: ' + text };
const emailChannel = { deliver: (text) => 'Email: ' + text };
const sirenChannel = { deliver: (text) => 'Siren: ' + text.toUpperCase() };

// Abstractions: what is sent, delegating the how
class Alert {
  constructor(channel) {
    this.channel = channel; // the “bridge”
  }
  send(message) {
    return this.channel.deliver(this.format(message));
  }
  format(message) {
    return message;
  }
}

class InfoAlert extends Alert {
  format(message) {
    return 'ℹ ' + message;
  }
}

class UrgentAlert extends Alert {
  format(message) {
    return '‼ ' + message + ' — check the tank now';
  }
}

console.log(new InfoAlert(emailChannel).send('Water change scheduled'));
console.log(new UrgentAlert(phoneChannel).send('Temperature 31 °C'));
console.log(new UrgentAlert(sirenChannel).send('Leak in the sump'));
// 2 abstractions × 3 channels = 6 combinations with 5 pieces`,
  },
  related: ['adapter', 'strategy', 'abstract-factory'],
};
