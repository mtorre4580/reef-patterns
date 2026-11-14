import type { Pattern } from '../types';

export const retry: Pattern = {
  id: 'retry',
  rank: 35,
  name: 'Retry with Backoff',
  nameEs: 'Reintento con espera exponencial',
  category: 'resiliencia',
  tier: 3,
  gof: false,
  summary:
    'Repite una operación que falló por un error transitorio, esperando cada vez más entre intentos.',
  when: 'Cuando una operación falla de forma intermitente (red, servicios saturados) y es segura de repetir porque es idempotente.',
  pros: [
    'Absorbe fallas transitorias sin molestar al usuario.',
    'El backoff con jitter evita saturar a un servicio que se está recuperando.',
  ],
  cons: [
    'Reintentar operaciones no idempotentes duplica efectos.',
    'Aumenta la latencia total cuando la falla es permanente.',
  ],
  realWorld:
    'El retry de TanStack Query, axios-retry, p-retry, los SDK de AWS con exponential backoff y jitter.',
  example: {
    title: 'Leer el controlador por Wi-Fi',
    scenario:
      'El controlador del acuario está lejos del router y a veces no responde. La app reintenta hasta cuatro veces con esperas crecientes antes de mostrar un error.',
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

// Simulación: falla dos veces y luego responde
let calls = 0;
const readController = async () => {
  calls++;
  if (calls < 3) throw Object.assign(new Error('timeout'), { transient: true });
  return { temp: 25.3, ph: 8.15 };
};

retry(readController, { isRetryable: (e) => e.transient })
  .then((data) => console.log('Lectura tras ' + calls + ' intentos', data))
  .catch((e) => console.error('Sin conexión:', e.message));`,
  },
  related: ['circuit-breaker', 'bulkhead', 'proxy'],
};
