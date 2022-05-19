import { Injector } from './injector';

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

let _currentInjector: undefined | Injector;

/**
 * For internal or tooling usage only.
 *
 * Sets current injector context for the inject() function.
 *
 * @param injector
 */
export function setCurrentInjector(injector: Injector): () => void {
  const previous = _currentInjector;
  _currentInjector = injector;
  return (): void => {
    _currentInjector = previous;
  };
}

/**
 * Injects service from the current injector.
 *
 * Can be used only, when injection context is defined:
 *  -
 *
 * @param token
 * @param defaultValue
 */

export function inject<K extends keyof InjectionTokensContractMap>(
  token: K
): InjectionTokensContractMap[K];
export function inject<K extends keyof InjectionTokensContractMap, L>(
  token: K,
  defaultValue?: L
): InjectionTokensContractMap[K] | L;
export function inject<K>(token: Type<K>, defaultValue?: K): K;
export function inject<K, L>(token: Type<K>, defaultValue?: L): K | L;
export function inject<K = any>(token: string, defaultValue?: K): K;
export function inject(token: any, defaultValue?: any): any {
  if (_currentInjector === undefined) {
    throw new Error(`inject() can't be used outside injection context!'`);
  }

  try {
    return _currentInjector.inject(token);
  } catch (error) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw error;
  }
}
