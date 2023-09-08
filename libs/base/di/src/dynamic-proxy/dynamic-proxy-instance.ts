import { Injector } from '@spryker-oryx/di';
import {
  defer,
  EMPTY,
  from,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';
import { setCurrentInjector } from '../inject';
import { Type } from '../models/type';

const createProxyHandler = <T>(
  lazyImport: () => Promise<Type<T>>,
  injector: Injector,
  instanceCallback?: (instance: T) => void
) => {
  let instance: T | null = null;

  const initInstance = async () => {
    if (!instance) {
      const module = await lazyImport();
      const restoreInjector = setCurrentInjector(injector);
      instance = new module();
      instanceCallback?.(instance);
      restoreInjector();
    }
    return instance;
  };

  const instance$ = defer(() => from(initInstance())).pipe(shareReplay());

  return {
    get(target: any, propKey: string): any {
      if (typeof propKey === 'string' && propKey !== 'then') {
        return (...methodArgs: any[]) => {
          if (instance) {
            return (instance as any)[propKey](...methodArgs);
          }

          const result = instance$.pipe(
            map((instance) => {
              const result: any = (instance as any)[propKey](...methodArgs);

              if (result instanceof Observable) {
                return result;
              } else return EMPTY;
            }),
            switchMap((result) => result),
            shareReplay()
          );

          result.subscribe();
          return result;
        };
      }
    },
  };
};

export const createLazyProxy = <T>(
  lazyImport: () => Promise<Type<T>>,
  injector: Injector,
  instanceCallback?: (instance: T) => void
): T => {
  return new Proxy(
    {},
    createProxyHandler<T>(lazyImport, injector, instanceCallback)
  ) as T;
};
