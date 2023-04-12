import { Observable, Subscription } from 'rxjs';
import { Signal } from './core';
import { SignalConsumer, StateSignal } from './core/signals';

export interface ConnectableSignal<T> extends Signal<T> {
  connect(): ConnectableSignal<T>;
  disconnect(): void;
}

export class SignalObservable<T, K = undefined> extends StateSignal<T | K> {
  subscription?: Subscription;

  constructor(protected observable: Observable<T>, initialValue?: K) {
    super(initialValue as K);
  }

  watch(sniffer: SignalConsumer): void {
    if (this.consumers.size === 0) this.connect();
    super.watch(sniffer);
  }

  unwatch(sniffer: SignalConsumer): void {
    if (this.consumers.size === 1) this.disconnect();
    super.unwatch(sniffer);
  }

  connect(): void {
    if (!this.subscription) {
      this.subscription = this.observable.subscribe((value) => this.set(value));
    }
  }

  disconnect(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}

/** Creates a signal from an observable.
 *
 * TODO: We could consider:
 * - accepting also promises
 * - exposing set() method to allow reusing signal for different observables/promises
 *
 * */
export function signalFrom<T, K = undefined>(
  observable$: Observable<T>,
  initialValue?: K
): ConnectableSignal<T | K> {
  const obsSignal = new SignalObservable(observable$, initialValue);

  const signal = () => obsSignal.value;
  signal.connect = () => {
    obsSignal.connect();
    return signal;
  };
  signal.disconnect = () => obsSignal.disconnect();

  signal.valueOf = () => obsSignal.value;
  signal.toString = () => String(obsSignal.value);

  return signal as ConnectableSignal<T | K>;
}
