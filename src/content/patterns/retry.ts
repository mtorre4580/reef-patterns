import type { Pattern } from '../types';

export const retry: Pattern = {
  id: 'retry',
  rank: 35,
  name: 'Retry with Backoff',
  localName: {
    en: 'Retry with Backoff',
    es: 'Reintento con espera exponencial',
    'pt-BR': 'Nova tentativa com espera exponencial',
  },
  category: 'resiliencia',
  tier: 3,
  gof: false,
  summary: {
    en: 'Repeats an operation that failed with a transient error, waiting longer between each attempt.',
    es: 'Repite una operación que falló por un error transitorio, esperando cada vez más entre intentos.',
    'pt-BR':
      'Repete uma operação que falhou por um erro transitório, esperando cada vez mais entre as tentativas.',
  },
  when: {
    en: 'When an operation fails intermittently (network, overloaded services) and is safe to repeat because it is idempotent.',
    es: 'Cuando una operación falla de forma intermitente (red, servicios saturados) y es segura de repetir porque es idempotente.',
    'pt-BR':
      'Quando uma operação falha de forma intermitente (rede, serviços saturados) e é segura de repetir porque é idempotente.',
  },
  pros: {
    en: [
      'Absorbs transient failures without bothering the user.',
      'Backoff with jitter avoids hammering a recovering service.',
    ],
    es: [
      'Absorbe fallas transitorias sin molestar al usuario.',
      'El backoff con jitter evita saturar a un servicio que se está recuperando.',
    ],
    'pt-BR': [
      'Absorve falhas transitórias sem incomodar o usuário.',
      'O backoff com jitter evita sobrecarregar um serviço que está se recuperando.',
    ],
  },
  cons: {
    en: [
      'Retrying non-idempotent operations duplicates effects.',
      'Increases total latency when the failure is permanent.',
    ],
    es: [
      'Reintentar operaciones no idempotentes duplica efectos.',
      'Aumenta la latencia total cuando la falla es permanente.',
    ],
    'pt-BR': [
      'Repetir operações não idempotentes duplica efeitos.',
      'Aumenta a latência total quando a falha é permanente.',
    ],
  },
  realWorld: {
    en: "TanStack Query's retry, axios-retry, p-retry, AWS SDKs with exponential backoff and jitter.",
    es: 'El retry de TanStack Query, axios-retry, p-retry, los SDK de AWS con exponential backoff y jitter.',
    'pt-BR':
      'O retry do TanStack Query, axios-retry, p-retry, os SDKs da AWS com exponential backoff e jitter.',
  },
  example: {
    title: {
      en: 'Reading the controller over Wi-Fi',
      es: 'Leer el controlador por Wi-Fi',
      'pt-BR': 'Ler o controlador por Wi-Fi',
    },
    scenario: {
      en: 'The tank controller is far from the router and sometimes does not answer. The app retries up to four times with growing waits before showing an error.',
      es: 'El controlador del acuario está lejos del router y a veces no responde. La app reintenta hasta cuatro veces con esperas crecientes antes de mostrar un error.',
      'pt-BR':
        'O controlador do aquário está longe do roteador e às vezes não responde. O app tenta de novo até quatro vezes com esperas crescentes antes de mostrar um erro.',
    },
    code: `const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(operation, { attempts = 4, baseMs = 100, isRetryable = () => true } = {}) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === attempts - 1) break;
      const jitter = Math.random() * baseMs;
      await sleep(baseMs * 2 ** attempt + jitter); // 100, 200, 400… + jitter
    }
  }
  throw lastError;
}

// Simulation: fails twice, then answers
let calls = 0;
const readController = async () => {
  calls++;
  if (calls < 3) throw Object.assign(new Error('timeout'), { transient: true });
  return { temp: 25.3, ph: 8.15 };
};

retry(readController, { isRetryable: (e) => e.transient })
  .then((data) => console.log('Reading after ' + calls + ' attempts', data))
  .catch((e) => console.error('Offline:', e.message));`,
  },
  related: ['circuit-breaker', 'bulkhead', 'proxy'],
};
