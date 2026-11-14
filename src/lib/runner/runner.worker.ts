import { executeChallenge } from './execute';
import type { RunRequest } from './types';

// Worker de un solo uso: el hilo principal crea uno nuevo por ejecución
self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const result = await executeChallenge(event.data);
  self.postMessage(result);
};
