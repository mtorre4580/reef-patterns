import type { Pattern } from '../types';

export const bridge: Pattern = {
  id: 'bridge',
  rank: 40,
  name: 'Bridge',
  nameEs: 'Puente',
  category: 'estructural',
  tier: 3,
  gof: true,
  summary:
    'Separa una abstracción de su implementación para que ambas varíen de forma independiente.',
  when: 'Cuando tenés dos dimensiones que cambian por separado (qué hace y en qué plataforma lo hace) y la herencia te obligaría a una clase por cada combinación.',
  pros: [
    'Evita la explosión de subclases M × N.',
    'Abstracciones e implementaciones evolucionan por separado.',
  ],
  cons: [
    'Más difícil de entender que una jerarquía simple.',
    'Diseñarlo de antemano sin dos dimensiones reales es sobreingeniería.',
  ],
  realWorld:
    'Los renderers de React (DOM, Native, Three.js) bajo la misma API de componentes, los drivers de Knex, los transportes de winston.',
  example: {
    title: 'Alertas por distintos canales',
    scenario:
      'Hay alertas de distintos tipos (informativa, urgente) y canales de envío (celular, email, sirena). Cualquier alerta puede salir por cualquier canal.',
    code: `// Implementaciones: cómo se envía
const phoneChannel = { deliver: (text) => 'Push: ' + text };
const emailChannel = { deliver: (text) => 'Email: ' + text };
const sirenChannel = { deliver: (text) => 'Sirena: ' + text.toUpperCase() };

// Abstracciones: qué se envía, delegando el cómo
class Alert {
  constructor(channel) {
    this.channel = channel; // el “puente”
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
    return '‼ ' + message + ' — revisá el acuario ahora';
  }
}

console.log(new InfoAlert(emailChannel).send('Cambio de agua programado'));
console.log(new UrgentAlert(phoneChannel).send('Temperatura 31 °C'));
console.log(new UrgentAlert(sirenChannel).send('Fuga en el sump'));
// 2 abstracciones × 3 canales = 6 combinaciones con 5 piezas`,
  },
  related: ['adapter', 'strategy', 'abstract-factory'],
};
