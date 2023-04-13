import { isObservable, Observable } from 'rxjs';
import { Computed } from './core';
import { createSignal, SettableSignal, Signal } from './core/factories';
import { ConnectableSignal, signalFrom } from './signal-from';

export { effect } from './core/factories';
export type { Signal } from './core/factories';
export { Effect } from './core/signals';

/**
 * Factory function for creating signals with built-in support for observables:
 * - If the first argument is a value, a signal will be created with the value.
 * - If the first argument is an observable, a signal will be created from the observable.
 */
export function signal<T>(
  observable: Observable<T>,
  initialValue: T
): ConnectableSignal<T>;
export function signal<T, K = undefined>(
  observable: Observable<T>,
  initialValue?: K
): ConnectableSignal<T | K>;
export function signal<T>(value: T): SettableSignal<T>;
export function signal<T>(
  value: T | Observable<T>,
  options?: any
): SettableSignal<T> | ConnectableSignal<T | any> {
  if (isObservable(value)) {
    return signalFrom(value, options);
  }

  return createSignal(value);
}

/**
 * Factory function for creating computes with built-in support for observables
 * - If computed result is an observable, a transparent signal will be created from the observable.
 */
export function computed<T>(
  computation: () => Observable<T>
): ConnectableSignal<T | undefined>;
export function computed<T>(computation: () => T): Signal<T>;
export function computed<T>(
  computation: () => T | Observable<T>
): Signal<T> | ConnectableSignal<T | undefined> {
  const instance = new Computed(computation);

  let last: undefined | T | Observable<T>;
  let observableSignal: undefined | ConnectableSignal<T>;

  function getValue() {
    const value = instance.value;
    if (isObservable(value)) {
      if (value !== last) {
        last = value;
        observableSignal = signalFrom(value);
      }
      return observableSignal!();
    }
    return value;
  }

  const computed = () => getValue();
  computed.valueOf = () => getValue();
  computed.toString = () => String(getValue());

  return computed as Signal<T>;
}
