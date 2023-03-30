import { Observable, Subscription } from 'rxjs';
import { Signal } from './core';
import { SignalConsumer, StateSignal } from './core/signals';

export interface ConnectableSignal<T> extends Signal<T> {
  connect(): void;
  disconnect(): void;
}

class SignalObservable<T> extends StateSignal<T | undefined> {
  subscription?: Subscription;

  constructor(protected observable: Observable<T>) {
    super(undefined);
  }

  watch(sniffer: SignalConsumer) {
    this.connect();
    super.watch(sniffer);
  }

  unwatch(sniffer: SignalConsumer) {
    this.disconnect();
    super.unwatch(sniffer);
  }

  connect() {
    if (!this.subscription) {
      this.subscription = this.observable.subscribe((value) => this.set(value));
    }
  }

  disconnect() {
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
export function signalFrom<T>(
  observable$: Observable<T>
): ConnectableSignal<T | undefined> {
  const obsSignal = new SignalObservable(observable$);

  const signal = () => obsSignal.value;
  signal.connect = () => obsSignal.connect();
  signal.disconnect = () => obsSignal.disconnect();

  return signal as ConnectableSignal<T | undefined>;
}
