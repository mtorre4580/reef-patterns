import type { Pattern } from '../types';

export const circuitBreaker: Pattern = {
  id: 'circuit-breaker',
  rank: 36,
  name: 'Circuit Breaker',
  nameEs: 'Cortacircuitos',
  category: 'resiliencia',
  tier: 3,
  gof: false,
  summary:
    'Deja de llamar a un servicio que falla repetidamente y vuelve a probar después de un tiempo, como un disyuntor.',
  when: 'Cuando un servicio caído hace que cada llamada espere hasta el timeout, degradando toda la app; es mejor fallar rápido y reintentar más tarde.',
  pros: [
    'Falla rápido en lugar de acumular esperas.',
    'Da tiempo al servicio a recuperarse.',
    'Permite una respuesta alternativa mientras está abierto.',
  ],
  cons: [
    'Calibrar umbrales y tiempos requiere datos reales.',
    'Un estado compartido mal sincronizado abre o cierra de más.',
  ],
  realWorld:
    'opossum en Node, Resilience4j, Polly en .NET, las políticas de outlier detection de Envoy e Istio.',
  example: {
    title: 'Servicio de pronóstico de mareas',
    scenario:
      'El simulador de mareas consulta un servicio externo. Si falla tres veces seguidas, se usa la última tabla conocida durante 30 segundos antes de volver a intentar.',
    code: `class CircuitBreaker {
  state = 'closed'; // closed → open → half-open
  failures = 0;
  openedAt = 0;

  constructor(operation, { threshold = 3, cooldownMs = 30_000, now = Date.now } = {}) {
    Object.assign(this, { operation, threshold, cooldownMs, now });
  }

  async call(...args) {
    if (this.state === 'open') {
      if (this.now() - this.openedAt < this.cooldownMs) throw new Error('Circuito abierto');
      this.state = 'half-open'; // dejamos pasar una prueba
    }
    try {
      const result = await this.operation(...args);
      this.state = 'closed';
      this.failures = 0;
      return result;
    } catch (error) {
      this.failures++;
      if (this.state === 'half-open' || this.failures >= this.threshold) {
        this.state = 'open';
        this.openedAt = this.now();
      }
      throw error;
    }
  }
}

const lastKnownTides = [{ hour: 6, level: 'alta' }];
const tideService = new CircuitBreaker(async () => {
  throw new Error('503');
});

async function getTides() {
  try {
    return await tideService.call();
  } catch {
    return lastKnownTides; // respuesta alternativa
  }
}

getTides().then(() => getTides()).then(() => getTides()).then(() => console.log(tideService.state)); // open`,
  },
  related: ['retry', 'bulkhead', 'state'],
};
