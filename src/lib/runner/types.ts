import type { AstCheck, ChallengeTest } from '@/content/types';

export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  args: string[];
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  kind: 'test' | 'check';
}

export interface RunRequest {
  code: string;
  tests: ChallengeTest[];
  checks?: AstCheck[];
  timeoutMs?: number;
}

export interface RunResult {
  results: TestResult[];
  logs: LogEntry[];
  durationMs: number;
  timedOut?: boolean;
}

export const DEFAULT_TIMEOUT_MS = 2000;
export const TIMEOUT_MESSAGE = 'Tiempo agotado: ¿hay un bucle infinito?';
