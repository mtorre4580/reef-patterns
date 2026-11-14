import type { Challenge } from '../types';
import { observer1 } from './observer/observer-1';

/** Registro de challenges. Cada archivo vive en challenges/<patternId>/<patternId>-<n>.ts */
export const challenges: Challenge[] = [observer1];
