import { getInjector } from './get-injector';

export function resolve<K extends keyof InjectionTokensContractMap>(
  token: K
): InjectionTokensContractMap[K];
export function resolve<K extends keyof InjectionTokensContractMap, L>(
  token: K,
  defaultValue?: L,
  context?: any
): InjectionTokensContractMap[K] | L;
export function resolve<K = any>(
  token: string,
  defaultValue?: K,
  context?: any
): K;
export function resolve<K = any>(
  token: string,
  defaultValue?: any,
  context?: any
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
