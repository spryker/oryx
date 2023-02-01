import { resolve } from '@spryker-oryx/di';
import { isServer, LitElement, ReactiveController } from 'lit';
import { from, isObservable, Observable, Subscription } from 'rxjs';
import { isPromise } from '../../guards';

interface ObservablesData {
  observable$?: Observable<unknown>;
  subscription?: Subscription;
  value?: unknown;
}

export class AsyncStateController implements ReactiveController {
  protected observables = new Map<string, ObservablesData>();
  // TODO: temporary solution should be solved with proper hook provided from lit
  protected context = resolve('FES.ContextService', null);

  protected isConnected = false;

  constructor(protected host: LitElement) {
    host.addController(this);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.context as any)?.rendered$?.subscribe?.(() => {
      this.disconnect();
    });
  }

  add(key: string, value: unknown): void {
    let oldValue: unknown = undefined;
    if (this.observables.has(key)) {
      const current = this.observables.get(key);
      oldValue = current?.value;
      current?.subscription?.unsubscribe();
      this.observables.delete(key);
    }

    if (!isObservable(value) && isPromise(value)) {
      value = from(value);
    }

    if (!isObservable(value)) {
      // shortcut for primitive values
      this.observables.set(key, { value });
      if (oldValue !== value && !isServer) {
        this.host.requestUpdate(key, oldValue);
      }
      return;
    }

    this.observables.set(key, {
      observable$: value as Observable<unknown>,
    });

    if (this.isConnected) {
      if (oldValue !== undefined && !isServer) {
        this.host.requestUpdate(key, oldValue);
      }
      this.subscribe(key);
    }
  }

  get(key: string): unknown {
    return this.observables.get(key)?.value;
  }

  protected subscribe(key: string): void {
    const data = this.observables.get(key)!;

    if (data?.subscription || !data?.observable$) {
      return;
    }

    data.subscription = data.observable$.subscribe((value) => {
      const oldValue = data.value;
      if (oldValue !== value) {
        data.value = value;
        this.host.requestUpdate(key, oldValue);
      }
    });
  }

  protected connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    for (const key of this.observables.keys()) {
      this.subscribe(key);
    }
  }

  protected disconnect(): void {
    if (!this.isConnected) return;
    this.isConnected = false;
    for (const observable$ of this.observables.values()) {
      if (observable$.subscription) {
        observable$.subscription.unsubscribe();
        delete observable$.subscription;
      }
    }
  }

  hostConnected(): void {
    this.connect();
  }

  hostDisconnected(): void {
    this.disconnect();
  }
}
