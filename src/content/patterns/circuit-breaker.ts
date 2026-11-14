import type { Pattern } from '../types';

export const circuitBreaker: Pattern = {
  id: 'circuit-breaker',
  rank: 36,
  name: 'Circuit Breaker',
  localName: { en: 'Circuit Breaker', es: 'Cortacircuitos', 'pt-BR': 'Disjuntor' },
  category: 'resiliencia',
  tier: 3,
  gof: false,
  summary: {
    en: 'Stops calling a service that keeps failing and tries again after a while, like an electrical breaker.',
    es: 'Deja de llamar a un servicio que falla repetidamente y vuelve a probar después de un tiempo, como un disyuntor.',
    'pt-BR':
      'Para de chamar um serviço que falha repetidamente e volta a tentar depois de um tempo, como um disjuntor.',
  },
  when: {
    en: 'When a down service makes every call wait until the timeout, dragging the whole app down; better to fail fast and retry later.',
    es: 'Cuando un servicio caído hace que cada llamada espere hasta el timeout, degradando toda la app; es mejor fallar rápido y reintentar más tarde.',
    'pt-BR':
      'Quando um serviço fora do ar faz cada chamada esperar até o timeout, degradando o app inteiro; é melhor falhar rápido e tentar mais tarde.',
  },
  pros: {
    en: [
      'Fails fast instead of piling up waits.',
      'Gives the service time to recover.',
      'Allows a fallback response while it is open.',
    ],
    es: [
      'Falla rápido en lugar de acumular esperas.',
      'Da tiempo al servicio a recuperarse.',
      'Permite una respuesta alternativa mientras está abierto.',
    ],
    'pt-BR': [
      'Falha rápido em vez de acumular esperas.',
      'Dá tempo ao serviço para se recuperar.',
      'Permite uma resposta alternativa enquanto está aberto.',
    ],
  },
  cons: {
    en: [
      'Tuning thresholds and timings needs real data.',
      'Poorly synchronized shared state opens or closes too often.',
    ],
    es: [
      'Calibrar umbrales y tiempos requiere datos reales.',
      'Un estado compartido mal sincronizado abre o cierra de más.',
    ],
    'pt-BR': [
      'Calibrar limites e tempos exige dados reais.',
      'Um estado compartilhado mal sincronizado abre ou fecha demais.',
    ],
  },
  realWorld: {
    en: 'opossum on Node, Resilience4j, Polly on .NET, Envoy and Istio outlier detection.',
    es: 'opossum en Node, Resilience4j, Polly en .NET, las políticas de outlier detection de Envoy e Istio.',
    'pt-BR':
      'opossum no Node, Resilience4j, Polly no .NET, as políticas de outlier detection do Envoy e do Istio.',
  },
  example: {
    title: {
      en: 'Tide forecast service',
      es: 'Servicio de pronóstico de mareas',
      'pt-BR': 'Serviço de previsão de marés',
    },
    scenario: {
      en: 'The tide simulator queries an external service. If it fails three times in a row, the last known table is used for 30 seconds before trying again.',
      es: 'El simulador de mareas consulta un servicio externo. Si falla tres veces seguidas, se usa la última tabla conocida durante 30 segundos antes de volver a intentar.',
      'pt-BR':
        'O simulador de marés consulta um serviço externo. Se ele falha três vezes seguidas, usa-se a última tabela conhecida durante 30 segundos antes de tentar de novo.',
    },
    code: `class CircuitBreaker {
  state = 'closed'; // closed → open → half-open
  failures = 0;
  openedAt = 0;

  constructor(operation, { threshold = 3, cooldownMs = 30_000, now = Date.now } = {}) {
    Object.assign(this, { operation, threshold, cooldownMs, now });
  }

  async call(...args) {
    if (this.state === 'open') {
      if (this.now() - this.openedAt < this.cooldownMs) throw new Error('Circuit open');
      this.state = 'half-open'; // let one trial request through
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

const lastKnownTides = [{ hour: 6, level: 'high' }];
const tideService = new CircuitBreaker(async () => {
  throw new Error('503');
});

async function getTides() {
  try {
    return await tideService.call();
  } catch {
    return lastKnownTides; // fallback response
  }
}

getTides().then(() => getTides()).then(() => getTides()).then(() => console.log(tideService.state)); // open`,
  },
  related: ['retry', 'bulkhead', 'state'],
};
