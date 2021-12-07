import { Injector } from './injector';

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
  return () => {
    _currentInjector = previous;
  };
}

/**
 * Injects sevice from the current injector.
 *
 * Can be used only, when injection context is defined:
 *  -
 *
 * @param token
 */
export function inject<K extends keyof InjectionTokensContractMap>(
  token: K
): InjectionTokensContractMap[K];
export function inject(token: any): any;
export function inject(token: any): any {
  if (_currentInjector === undefined) {
    throw new Error(`inject() can't be used outside injection context!'`);
  }
  return _currentInjector.inject(token);
}
