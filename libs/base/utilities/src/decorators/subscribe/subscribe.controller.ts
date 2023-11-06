import { resolve } from '@spryker-oryx/di';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription, isObservable } from 'rxjs';

interface ObservablesData {
  observable$: Observable<unknown>;
  subscription: Subscription | null;
}

export class SubscribeController implements ReactiveController {
  protected observables = new Map<string, ObservablesData>();
  // TODO: temporary solution should be solved with proper hook provided from lit
  protected context = resolve('FES.ContextService', null);

  constructor(public host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.context as any)?.rendered$?.subscribe?.(() => this.unsubscribe());
  }

  hostConnected(): void {
    for (const observable$ of this.observables.keys()) {
      this.subscribe(observable$);
    }
  }

  hostDisconnected(): void {
    this.unsubscribe();
  }

  add(observable$: unknown, key: string): void {
    if (this.observables.has(key)) {
      return;
    }

    if (!isObservable(observable$)) {
      throw `Invalid SubscribeController value: incorrect ${observable$} for SubscribeController, use observable`;
    }

    this.observables.set(key, {
      observable$,
      subscription: null,
    });
  }

  protected subscribe(key: string): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = this.observables.get(key)!;

    if (data?.subscription) {
      return;
    }

    data.subscription = data.observable$.subscribe();
  }

  protected unsubscribe(): void {
    for (const observable$ of this.observables.values()) {
      if (observable$.subscription) {
        observable$.subscription.unsubscribe();
        observable$.subscription = null;
      }
    }
  }
}
