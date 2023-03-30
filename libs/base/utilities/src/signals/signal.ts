import { isObservable, Observable } from 'rxjs';
import { createSignal, SettableSignal } from './core/factories';
import { ConnectableSignal, signalFrom } from './signal-from';

export function signal<T>(
  observable: Observable<T>
): ConnectableSignal<T | undefined>;
export function signal<T>(value: T): SettableSignal<T>;
export function signal<T>(
  value: T | Observable<T>
): SettableSignal<T> | ConnectableSignal<T | undefined> {
  if (isObservable(value)) {
    return signalFrom(value);
  }

  return createSignal(value);
}
