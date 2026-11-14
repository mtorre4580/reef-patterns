import type { Pattern } from '../types';

export const dependencyInjection: Pattern = {
  id: 'dependency-injection',
  rank: 8,
  name: 'Dependency Injection',
  nameEs: 'Inyección de dependencias',
  category: 'arquitectura',
  tier: 1,
  gof: false,
  summary: 'Un objeto recibe sus colaboradores desde afuera en lugar de crearlos él mismo.',
  when: 'Cuando una clase usa servicios (red, reloj, almacenamiento, sensores) que querés reemplazar en tests o según el entorno.',
  pros: [
    'Tests simples: se inyecta un doble en lugar del servicio real.',
    'Las dependencias quedan explícitas en la firma.',
    'Cambiar una implementación no obliga a tocar a quien la usa.',
  ],
  cons: [
    'Más parámetros y más cableado en el punto de arranque.',
    'Con contenedores automáticos, el flujo se vuelve “mágico”.',
  ],
  realWorld:
    'El sistema de providers de Angular, NestJS, el Context de React como inyección implícita, los parámetros de fábricas en tests con Vitest.',
  example: {
    title: 'Monitor de parámetros con sensor inyectado',
    scenario:
      'El monitor de pH alerta si el valor sale de rango. En el acuario usa la sonda real; en los tests y en la demo usa un sensor simulado.',
    code: `class PhMonitor {
  // El monitor no crea su sensor ni su notificador: se los dan
  constructor({ sensor, notify }) {
    this.sensor = sensor;
    this.notify = notify;
  }

  check() {
    const ph = this.sensor.read();
    if (ph < 7.9 || ph > 8.4) this.notify('pH fuera de rango: ' + ph);
    return ph;
  }
}

// Implementación real (simplificada)
const probe = { read: () => 8.12 };

// Doble para pruebas: siempre devuelve un valor bajo
const fakeLowSensor = { read: () => 7.7 };
const sent = [];

const monitor = new PhMonitor({ sensor: probe, notify: console.warn });
monitor.check();

const testMonitor = new PhMonitor({ sensor: fakeLowSensor, notify: (msg) => sent.push(msg) });
testMonitor.check();
console.log(sent); // ['pH fuera de rango: 7.7']`,
  },
  related: ['provider', 'strategy', 'hexagonal', 'singleton'],
};
