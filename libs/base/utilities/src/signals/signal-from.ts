import { Observable, Subscription } from 'rxjs';
import { Signal, SignalOptions } from './core';
import { SignalConsumer, StateSignal } from './core/signals';

export interface ConnectableSignal<T> extends Signal<T> {
  connect(): ConnectableSignal<T>;
  disconnect(): void;
}

export interface ConnectableSignalOptions<T, K> extends SignalOptions<T | K> {
  initialValue?: K;
}

let _resolvingSignals: number | undefined = undefined;
let _resolvingSignalsNotifier: StateSignal<number> | undefined = undefined;
let _ss_counter = 0;

function setResolvingStatus(state = true): void {
  if (state) {
    if (_resolvingSignals !== undefined) _resolvingSignals++;
    return;
  }

  if (_resolvingSignalsNotifier) {
    _resolvingSignalsNotifier.set(_ss_counter++);
  }
}

export function resolvingSignals(): () => boolean | number {
  const prevResolving = _resolvingSignals;
  _resolvingSignals = 0;

  return () => {
    if (!_resolvingSignals) return false;
    if (!_resolvingSignalsNotifier)
      _resolvingSignalsNotifier = new StateSignal<number>(_ss_counter++);
    _resolvingSignalsNotifier.accessed();
    const result = _resolvingSignals;
    _resolvingSignals = prevResolving;
    return result;
  };
}

export class SignalObservable<T, K = undefined> extends StateSignal<T | K> {
  subscription?: Subscription;
  protected resolving = true;

  constructor(
    protected observable: Observable<T>,
    options?: ConnectableSignalOptions<T, K>
  ) {
    super(options?.initialValue as K, options);
  }

  get value(): T | K {
    this.accessed();
    if (!this.subscription) {
      let syncResult: T | undefined;
      this.observable.subscribe((value) => (syncResult = value)).unsubscribe();
      return (
        syncResult ??
        ((this.options as ConnectableSignalOptions<T, K>).initialValue as K)
      );
    }
    if (this.resolving) {
      setResolvingStatus(true);
    }
    return this.state;
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
      this.subscription = this.observable.subscribe((value) => {
        if (this.resolving) {
          this.resolving = false;
          setResolvingStatus(false);
        }
        this.set(value);
      });
    }
  }

  disconnect(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    if (this.resolving) {
      this.resolving = false;
      setResolvingStatus(false);
    }
  }
}

/** Creates a signal from an observable.
 *
 * TODO: We could consider:
 * - accepting also promises
 * - exposing set() method to allow reusing signal for different observables/promises
 *
 * */
export function signalFrom<T, K = T>(
  observable$: Observable<T>,
  options?: ConnectableSignalOptions<T, K>
): ConnectableSignal<T | K> {
  const obsSignal = new SignalObservable(observable$, options);

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
