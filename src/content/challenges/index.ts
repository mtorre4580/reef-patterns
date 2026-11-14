import type { Challenge } from '../types';
import { adapter1 } from './adapter/adapter-1';
import { adapter2 } from './adapter/adapter-2';
import { builder1 } from './builder/builder-1';
import { builder2 } from './builder/builder-2';
import { command1 } from './command/command-1';
import { decorator1 } from './decorator/decorator-1';
import { decorator2 } from './decorator/decorator-2';
import { dependencyInjection1 } from './dependency-injection/dependency-injection-1';
import { dependencyInjection2 } from './dependency-injection/dependency-injection-2';
import { facade1 } from './facade/facade-1';
import { facade2 } from './facade/facade-2';
import { factoryMethod1 } from './factory-method/factory-method-1';
import { factoryMethod2 } from './factory-method/factory-method-2';
import { iterator1 } from './iterator/iterator-1';
import { iterator2 } from './iterator/iterator-2';
import { module1 } from './module/module-1';
import { module2 } from './module/module-2';
import { observer1 } from './observer/observer-1';
import { observer2 } from './observer/observer-2';
import { singleton1 } from './singleton/singleton-1';
import { singleton2 } from './singleton/singleton-2';
import { state1 } from './state/state-1';
import { strategy1 } from './strategy/strategy-1';
import { strategy2 } from './strategy/strategy-2';

/** Challenge registry. Each file lives at challenges/<patternId>/<patternId>-<n>.ts */
export const challenges: Challenge[] = [
  adapter1,
  adapter2,
  builder1,
  builder2,
  command1,
  decorator1,
  decorator2,
  dependencyInjection1,
  dependencyInjection2,
  facade1,
  facade2,
  factoryMethod1,
  factoryMethod2,
  iterator1,
  iterator2,
  module1,
  module2,
  observer1,
  observer2,
  singleton1,
  singleton2,
  state1,
  strategy1,
  strategy2,
];
