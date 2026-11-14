import type { Pattern } from '../types';

export const dependencyInjection: Pattern = {
  id: 'dependency-injection',
  rank: 8,
  name: 'Dependency Injection',
  localName: {
    en: 'Dependency Injection',
    es: 'Inyección de dependencias',
    'pt-BR': 'Injeção de dependências',
  },
  category: 'arquitectura',
  tier: 1,
  gof: false,
  summary: {
    en: 'An object receives its collaborators from the outside instead of creating them itself.',
    es: 'Un objeto recibe sus colaboradores desde afuera en lugar de crearlos él mismo.',
    'pt-BR': 'Um objeto recebe seus colaboradores de fora em vez de criá-los ele mesmo.',
  },
  when: {
    en: 'When a class uses services (network, clock, storage, sensors) that you want to replace in tests or per environment.',
    es: 'Cuando una clase usa servicios (red, reloj, almacenamiento, sensores) que querés reemplazar en tests o según el entorno.',
    'pt-BR':
      'Quando uma classe usa serviços (rede, relógio, armazenamento, sensores) que você quer substituir nos testes ou conforme o ambiente.',
  },
  pros: {
    en: [
      'Simple tests: inject a double instead of the real service.',
      'Dependencies are explicit in the signature.',
      'Changing an implementation does not touch whoever uses it.',
    ],
    es: [
      'Tests simples: se inyecta un doble en lugar del servicio real.',
      'Las dependencias quedan explícitas en la firma.',
      'Cambiar una implementación no obliga a tocar a quien la usa.',
    ],
    'pt-BR': [
      'Testes simples: injeta-se um dublê no lugar do serviço real.',
      'As dependências ficam explícitas na assinatura.',
      'Trocar uma implementação não obriga a mexer em quem a usa.',
    ],
  },
  cons: {
    en: [
      'More parameters and more wiring at the entry point.',
      'With automatic containers, the flow becomes "magic".',
    ],
    es: [
      'Más parámetros y más cableado en el punto de arranque.',
      'Con contenedores automáticos, el flujo se vuelve “mágico”.',
    ],
    'pt-BR': [
      'Mais parâmetros e mais ligações no ponto de inicialização.',
      'Com contêineres automáticos, o fluxo fica "mágico".',
    ],
  },
  realWorld: {
    en: "Angular's provider system, NestJS, React Context as implicit injection, factory parameters in Vitest tests.",
    es: 'El sistema de providers de Angular, NestJS, el Context de React como inyección implícita, los parámetros de fábricas en tests con Vitest.',
    'pt-BR':
      'O sistema de providers do Angular, o NestJS, o Context do React como injeção implícita, os parâmetros de factories nos testes com Vitest.',
  },
  example: {
    title: {
      en: 'Parameter monitor with an injected sensor',
      es: 'Monitor de parámetros con sensor inyectado',
      'pt-BR': 'Monitor de parâmetros com sensor injetado',
    },
    scenario: {
      en: 'The pH monitor alerts when the value goes out of range. In the tank it uses the real probe; in tests and in the demo it uses a simulated sensor.',
      es: 'El monitor de pH alerta si el valor sale de rango. En el acuario usa la sonda real; en los tests y en la demo usa un sensor simulado.',
      'pt-BR':
        'O monitor de pH alerta se o valor sai da faixa. No aquário usa a sonda real; nos testes e na demo usa um sensor simulado.',
    },
    code: `class PhMonitor {
  // The monitor does not create its sensor or notifier: they are handed to it
  constructor({ sensor, notify }) {
    this.sensor = sensor;
    this.notify = notify;
  }

  check() {
    const ph = this.sensor.read();
    if (ph < 7.9 || ph > 8.4) this.notify('pH out of range: ' + ph);
    return ph;
  }
}

// Real implementation (simplified)
const probe = { read: () => 8.12 };

// Test double: always returns a low value
const fakeLowSensor = { read: () => 7.7 };
const sent = [];

const monitor = new PhMonitor({ sensor: probe, notify: console.warn });
monitor.check();

const testMonitor = new PhMonitor({ sensor: fakeLowSensor, notify: (msg) => sent.push(msg) });
testMonitor.check();
console.log(sent); // ['pH out of range: 7.7']`,
  },
  related: ['provider', 'strategy', 'hexagonal', 'singleton'],
};
