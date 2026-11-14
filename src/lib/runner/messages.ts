import type { Locale } from '@/i18n/locales';

/** Runner output (assertions, AST checks, timeouts), localized. Runs inside the worker too. */
export interface RunnerMessages {
  toBe: (expected: string, received: string) => string;
  toEqual: (expected: string, received: string) => string;
  toBeTruthy: (received: string) => string;
  toThrowNeedsFunction: string;
  didNotThrow: string;
  wrongError: (expected: string, thrown: string) => string;
  needsSpy: (matcher: string) => string;
  notCalled: string;
  calledTimes: (expected: number, actual: number) => string;
  syntaxError: (detail: string) => string;
  loadError: (detail: string) => string;
  testTimeout: (ms: number) => string;
  timeout: string;
  runnerError: (detail: string) => string;
  forbidNode: (node: string) => string;
  missingClass: (name: string) => string;
  missingMethod: (className: string, method: string) => string;
  tooManyIfs: (count: number, max: number) => string;
  parseFailed: (detail: string) => string;
  anonymous: string;
}

const en: RunnerMessages = {
  toBe: (e, r) => `Expected ${e} but received ${r}`,
  toEqual: (e, r) => `Expected a value equal to ${e} but received ${r}`,
  toBeTruthy: (r) => `Expected a truthy value but received ${r}`,
  toThrowNeedsFunction: 'toThrow expects a function: expect(() => …).toThrow()',
  didNotThrow: 'Expected the function to throw an error',
  wrongError: (e, t) => `Expected an error matching ${e} but it threw ${t}`,
  needsSpy: (m) => `${m} expects a function created with fn()`,
  notCalled: 'Expected the function to be called',
  calledTimes: (e, a) =>
    `Expected the function to be called ${e} ${e === 1 ? 'time' : 'times'} but it was called ${a}`,
  syntaxError: (d) => `Syntax error: ${d}`,
  loadError: (d) => `Error while loading your code: ${d}`,
  testTimeout: (ms) => `The test did not finish within ${ms} ms`,
  timeout: 'Time is up: is there an infinite loop?',
  runnerError: (d) => `Runner error: ${d}`,
  forbidNode: (n) => `Found ${n} in the code`,
  missingClass: (n) => `Class ${n} is missing`,
  missingMethod: (c, m) => `${c} does not define ${m}()`,
  tooManyIfs: (c, m) => `There are ${c} if statements; the maximum is ${m}`,
  parseFailed: (d) => `Could not parse the code: ${d}`,
  anonymous: 'anonymous',
};

const es: RunnerMessages = {
  toBe: (e, r) => `Se esperaba ${e} y se recibió ${r}`,
  toEqual: (e, r) => `Se esperaba un valor igual a ${e} y se recibió ${r}`,
  toBeTruthy: (r) => `Se esperaba un valor verdadero y se recibió ${r}`,
  toThrowNeedsFunction: 'toThrow espera una función: expect(() => …).toThrow()',
  didNotThrow: 'Se esperaba que la función lanzara un error',
  wrongError: (e, t) => `Se esperaba un error con ${e} y se lanzó ${t}`,
  needsSpy: (m) => `${m} espera una función creada con fn()`,
  notCalled: 'Se esperaba que la función fuera llamada',
  calledTimes: (e, a) =>
    `Se esperaba que la función fuera llamada ${e} ${e === 1 ? 'vez' : 'veces'} y fue llamada ${a}`,
  syntaxError: (d) => `Error de sintaxis: ${d}`,
  loadError: (d) => `Error al cargar tu código: ${d}`,
  testTimeout: (ms) => `El test no terminó en ${ms} ms`,
  timeout: 'Tiempo agotado: ¿hay un bucle infinito?',
  runnerError: (d) => `Error en el runner: ${d}`,
  forbidNode: (n) => `Se encontró ${n} en el código`,
  missingClass: (n) => `Falta la clase ${n}`,
  missingMethod: (c, m) => `${c} no define ${m}()`,
  tooManyIfs: (c, m) => `Hay ${c} if; el máximo es ${m}`,
  parseFailed: (d) => `No se pudo analizar el código: ${d}`,
  anonymous: 'anónima',
};

const ptBR: RunnerMessages = {
  toBe: (e, r) => `Esperava ${e}, mas recebeu ${r}`,
  toEqual: (e, r) => `Esperava um valor igual a ${e}, mas recebeu ${r}`,
  toBeTruthy: (r) => `Esperava um valor verdadeiro, mas recebeu ${r}`,
  toThrowNeedsFunction: 'toThrow espera uma função: expect(() => …).toThrow()',
  didNotThrow: 'Esperava que a função lançasse um erro',
  wrongError: (e, t) => `Esperava um erro com ${e}, mas foi lançado ${t}`,
  needsSpy: (m) => `${m} espera uma função criada com fn()`,
  notCalled: 'Esperava que a função fosse chamada',
  calledTimes: (e, a) =>
    `Esperava que a função fosse chamada ${e} ${e === 1 ? 'vez' : 'vezes'}, mas foi chamada ${a}`,
  syntaxError: (d) => `Erro de sintaxe: ${d}`,
  loadError: (d) => `Erro ao carregar seu código: ${d}`,
  testTimeout: (ms) => `O teste não terminou em ${ms} ms`,
  timeout: 'Tempo esgotado: há um loop infinito?',
  runnerError: (d) => `Erro no runner: ${d}`,
  forbidNode: (n) => `Encontrado ${n} no código`,
  missingClass: (n) => `Falta a classe ${n}`,
  missingMethod: (c, m) => `${c} não define ${m}()`,
  tooManyIfs: (c, m) => `Há ${c} if; o máximo é ${m}`,
  parseFailed: (d) => `Não foi possível analisar o código: ${d}`,
  anonymous: 'anônima',
};

export const runnerMessages: Record<Locale, RunnerMessages> = { en, es, 'pt-BR': ptBR };
