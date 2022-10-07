import { Type } from '@spryker-oryx/utilities';
import { getInjector, InjectorContext } from './get-injector';

export function resolve<K extends keyof InjectionTokensContractMap>(
  token: K
): InjectionTokensContractMap[K];
export function resolve<K extends keyof InjectionTokensContractMap, L>(
  token: K,
  defaultValue?: L,
  context?: InjectorContext
): InjectionTokensContractMap[K] | L;
export function resolve<K>(
  token: Type<K>,
  defaultValue?: K,
  context?: InjectorContext
): K;
export function resolve<K, L>(
  token: Type<K>,
  defaultValue?: L,
  context?: InjectorContext
): K | L;
export function resolve<K = any>(
  token: string,
  defaultValue?: K,
  context?: InjectorContext
): K;
export function resolve<K = any>(
  token: any,
  defaultValue?: any,
  context?: InjectorContext
): K {
  try {
    return getInjector(context).inject(token, defaultValue);
  } catch (error) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw error;
  }
}
