import type { AstCheck, ChallengeTest } from '@/content/types';
import type { Locale } from '@/i18n/locales';

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
  /** Language for assertion and runner messages (English by default) */
  locale?: Locale;
}

export interface RunResult {
  results: TestResult[];
  logs: LogEntry[];
  durationMs: number;
  timedOut?: boolean;
}

export const DEFAULT_TIMEOUT_MS = 2000;
