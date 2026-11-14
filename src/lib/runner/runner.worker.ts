import { executeChallenge } from './execute';
import type { RunRequest } from './types';

// Single-use worker: the main thread creates a new one per run
self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const result = await executeChallenge(event.data);
  self.postMessage(result);
};
