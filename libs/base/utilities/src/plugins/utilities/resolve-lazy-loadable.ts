import { isPromise } from '../../guards';

export type LazyLoadable<T> = T | (() => Promise<T>);

export function resolveLazyLoadable<T>(impl: LazyLoadable<T>): T | Promise<T> {
  try {
    const value = (impl as () => Promise<T>)();

    return (isPromise(value) ? value : impl) as T | Promise<T>;
  } catch {
    return impl as T;
  }
}
