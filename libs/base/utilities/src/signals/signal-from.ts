import { Observable, Subscription } from 'rxjs';
import { Signal } from './core';
import { SignalConsumer, StateSignal } from './core/signals';

export interface ConnectableSignal<T> extends Signal<T> {
  connect(): ConnectableSignal<T>;
  disconnect(): void;
}

export let _resolvingSignals: number | undefined = undefined;

export function resolvingSignals(): () => void | boolean {
  _resolvingSignals = 1;

  return () => {
    const res = (_resolvingSignals ?? 1) > 1;
    _resolvingSignals = undefined;
    return res;
  };
}

export class SignalObservable<T, K = undefined> extends StateSignal<T | K> {
  subscription?: Subscription;
  protected resolving?: boolean;

  constructor(protected observable: Observable<T>, initialValue?: K) {
    super(initialValue as K);
  }

  get value(): T | K {
    this.accessed();
    if (!this.subscription) {
      let syncResult: T | undefined;
      this.observable.subscribe((value) => (syncResult = value)).unsubscribe();
      return syncResult ?? this.initialValue;
    }
    return this.state;
  }

  watch(sniffer: SignalConsumer): void {
    if (this.consumers.size === 0) this.connect();
    if (_resolvingSignals && this.resolving) {
      _resolvingSignals++;
    }
    super.watch(sniffer);
  }

  unwatch(sniffer: SignalConsumer): void {
    if (this.consumers.size === 1) this.disconnect();
    super.unwatch(sniffer);
  }

  connect(): void {
    if (!this.subscription) {
      this.resolving = true;
      this.subscription = this.observable.subscribe((value) => {
        if (!this.resolving) {
          this.set(value);
        } else {
          this.resolving = false;
          if (!this.set(value) && _resolvingSignals) {
            // force trigger change for resolving signals
            this.changed();
          }
        }
      });
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
