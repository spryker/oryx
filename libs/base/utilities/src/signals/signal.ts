import { isObservable, Observable } from 'rxjs';
import { createSignal, SettableSignal } from './core/factories';
import { ConnectableSignal, signalFrom } from './signal-from';

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
