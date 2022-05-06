import { getInjector } from './get-injector';

interface Type<T> extends Function {
  new (...args: any[]): T;
}

export function resolve<K extends keyof InjectionTokensContractMap>(
  context: any,
  token: K
): InjectionTokensContractMap[K];
export function resolve<K extends keyof InjectionTokensContractMap, L>(
  context: any,
  token: K,
  defaultValue?: L
): InjectionTokensContractMap[K] | L;
export function resolve<K>(context: any, token: Type<K>, defaultValue?: K): K;
export function resolve<K, L>(
  context: any,
  token: Type<K>,
  defaultValue?: L
): K | L;
export function resolve<K = any>(
  context: any,
  token: string,
  defaultValue?: K
): K;
export function resolve<K = any>(
  context: any,
  token: any,
  defaultValue?: any
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
