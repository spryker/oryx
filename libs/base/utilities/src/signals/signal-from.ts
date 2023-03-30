import { Observable, Subscription } from 'rxjs';
import { SignalConsumer, StateSignal } from './core/signals';

class SignalFromObservable<T> extends StateSignal<T | undefined> {
  subscription?: Subscription;

  constructor(protected obs: Observable<T>) {
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
      this.subscription = this.obs.subscribe((value) => this.set(value));
    }
  }

  disconnect() {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}

export interface ConnectableSignal<T> {
  (): T;
  connect(): void;
  disconnect(): void;
  version: number;
}

export function signalFrom<T>(
  observable$: Observable<T>
): ConnectableSignal<T | undefined> {
  const obsSignal = new SignalFromObservable(observable$);

  const signal = () => obsSignal.value;
  signal.connect = () => obsSignal.connect();
  signal.disconnect = () => obsSignal.disconnect();

  return signal as any;
}
