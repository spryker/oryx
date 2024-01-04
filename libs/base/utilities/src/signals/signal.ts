import { isObservable, Observable } from 'rxjs';
import { Computed, SignalOptions } from './core';
import { createSignal, SettableSignal, Signal } from './core/factories';
import {
  ConnectableSignal,
  ConnectableSignalOptions,
  signalFrom,
} from './signal-from';

export { effect } from './core/factories';
export type { SettableSignal, Signal } from './core/factories';
export { Effect } from './core/signals';

/**
 * Factory function for creating signals with built-in support for observables:
 * - If the first argument is a value, a signal will be created with the value.
 * - If the first argument is an observable, a signal will be created from the observable.
 */
export function signal<T>(
  observable: Observable<T>,
  options?: ConnectableSignalOptions<T, undefined>
): ConnectableSignal<T>;
export function signal<T, K = undefined>(
  observable: Observable<T>,
  options?: ConnectableSignalOptions<T, K>
): ConnectableSignal<T | K>;
export function signal<T>(
  value: T,
  options?: SignalOptions<T>
): SettableSignal<T>;
export function signal<T>(
  value: T | Observable<T>,
  options?: SignalOptions<T> | ConnectableSignalOptions<T, undefined>
): SettableSignal<T> | ConnectableSignal<T | any> {
  if (isObservable(value)) {
    return signalFrom(value, options as ConnectableSignalOptions<T, undefined>);
  }

  return createSignal(value, options as SignalOptions<T>);
}

/**
 * Factory function for creating computes with built-in support for observables
 * - If computed result is an observable, a transparent signal will be created from the observable.
 */
export function computed<T>(
  computation: () => Observable<T>,
  options?: SignalOptions<T>
): ConnectableSignal<T | undefined>;
export function computed<T>(computation: () => T): Signal<T>;
export function computed<T>(
  computation: () => T | Observable<T>,
  options?: ConnectableSignalOptions<T, undefined>
): Signal<T> | ConnectableSignal<T | undefined> {
  const instance = new Computed(
    computation as () => T,
    options as SignalOptions<T>
  );

  let last: undefined | T | Observable<T>;
  let observableSignal: undefined | ConnectableSignal<T | undefined>;

  function getValue() {
    const value = instance.value;
    if (isObservable(value)) {
      if (value !== last) {
        let previousValue = undefined;
        if (isObservable(last)) {
          previousValue = observableSignal!();
        }
        last = value;
        observableSignal = signalFrom(value as Observable<T>, {
          ...(options as ConnectableSignalOptions<T, undefined>),
          initialValue:
            previousValue !== undefined ? previousValue : options?.initialValue,
        });
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
