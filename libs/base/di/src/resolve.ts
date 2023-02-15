import { getInjector, InjectorContext } from './get-injector';
import { InferInjectType } from './inject';

/**
 * Works similarly to `inject`, but it tries to resolve the current injector using context (by default globalThis)
 * and then use it to resolve the token.
 *
 * This method is suitable to use in components, especially in web components, where the injection context
 * may not be defined at construction time.
 */
export function resolve<K extends keyof InjectionTokensContractMap>(
  token: K
): InferInjectType<K>;
export function resolve<K extends keyof InjectionTokensContractMap, L>(
  token: K,
  defaultValue?: L,
  context?: InjectorContext
): InferInjectType<K> | L;
export function resolve<K>(
  token: K,
  defaultValue?: K,
  context?: InjectorContext
): InferInjectType<K>;
export function resolve<K, L>(
  token: K,
  defaultValue?: L,
  context?: InjectorContext
): InferInjectType<K> | L;
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
