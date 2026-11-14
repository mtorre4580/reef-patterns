import type { Challenge, Pattern } from './types';
import { strategy } from './patterns/strategy';
import { observer } from './patterns/observer';
import { factoryMethod } from './patterns/factory-method';
import { singleton } from './patterns/singleton';
import { decorator } from './patterns/decorator';
import { adapter } from './patterns/adapter';
import { facade } from './patterns/facade';
import { dependencyInjection } from './patterns/dependency-injection';
import { builder } from './patterns/builder';
import { modulePattern } from './patterns/module';
import { iterator } from './patterns/iterator';
import { composite } from './patterns/composite';
import { command } from './patterns/command';
import { proxy } from './patterns/proxy';
import { repository } from './patterns/repository';
import { mvc } from './patterns/mvc';
import { mvvm } from './patterns/mvvm';
import { pubSub } from './patterns/pub-sub';
import { chainOfResponsibility } from './patterns/chain-of-responsibility';
import { templateMethod } from './patterns/template-method';
import { state } from './patterns/state';
import { abstractFactory } from './patterns/abstract-factory';
import { customHooks } from './patterns/custom-hooks';
import { provider } from './patterns/provider';
import { flux } from './patterns/flux';
import { containerPresentational } from './patterns/container-presentational';
import { compoundComponents } from './patterns/compound-components';
import { hoc } from './patterns/hoc';
import { renderProps } from './patterns/render-props';
import { middleware } from './patterns/middleware';
import { mediator } from './patterns/mediator';
import { memento } from './patterns/memento';
import { prototype } from './patterns/prototype';
import { nullObject } from './patterns/null-object';
import { retry } from './patterns/retry';
import { circuitBreaker } from './patterns/circuit-breaker';
import { debounceThrottle } from './patterns/debounce-throttle';
import { optimisticUi } from './patterns/optimistic-ui';
import { lazyLoading } from './patterns/lazy-loading';
import { bridge } from './patterns/bridge';
import { flyweight } from './patterns/flyweight';
import { plugin } from './patterns/plugin';
import { visitor } from './patterns/visitor';
import { interpreter } from './patterns/interpreter';
import { specification } from './patterns/specification';
import { cqrs } from './patterns/cqrs';
import { eventSourcing } from './patterns/event-sourcing';
import { saga } from './patterns/saga';
import { unitOfWork } from './patterns/unit-of-work';
import { bulkhead } from './patterns/bulkhead';
import { hexagonal } from './patterns/hexagonal';
import { objectPool } from './patterns/object-pool';
import { challenges } from './challenges';

/** Los 52 patrones ordenados por rank (frecuencia de uso). */
export const patterns: Pattern[] = [
  strategy,
  observer,
  factoryMethod,
  singleton,
  decorator,
  adapter,
  facade,
  dependencyInjection,
  builder,
  modulePattern,
  iterator,
  composite,
  command,
  proxy,
  repository,
  mvc,
  mvvm,
  pubSub,
  chainOfResponsibility,
  templateMethod,
  state,
  abstractFactory,
  customHooks,
  provider,
  flux,
  containerPresentational,
  compoundComponents,
  hoc,
  renderProps,
  middleware,
  mediator,
  memento,
  prototype,
  nullObject,
  retry,
  circuitBreaker,
  debounceThrottle,
  optimisticUi,
  lazyLoading,
  bridge,
  flyweight,
  plugin,
  visitor,
  interpreter,
  specification,
  cqrs,
  eventSourcing,
  saga,
  unitOfWork,
  bulkhead,
  hexagonal,
  objectPool,
].sort((a, b) => a.rank - b.rank);

export const patternsById: ReadonlyMap<string, Pattern> = new Map(patterns.map((p) => [p.id, p]));

/** Única vía de acceso a los challenges: la usa la rueda y el playground. */
export const challengesByPattern: ReadonlyMap<string, Challenge[]> = buildChallengeMap(challenges);

export const challengesById: ReadonlyMap<string, Challenge> = new Map(
  challenges.map((c) => [c.id, c]),
);

function buildChallengeMap(list: Challenge[]): Map<string, Challenge[]> {
  const map = new Map<string, Challenge[]>();
  for (const challenge of list) {
    const bucket = map.get(challenge.patternId) ?? [];
    bucket.push(challenge);
    map.set(challenge.patternId, bucket);
  }
  return map;
}

export { challenges };
export * from './types';
export * from './categories';
export * from './tiers';
