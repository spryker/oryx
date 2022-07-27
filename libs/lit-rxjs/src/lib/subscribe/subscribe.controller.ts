import { ContextService } from '@spryker-oryx/core';
import { ServerContextService } from '@spryker-oryx/core/server';
import { resolve } from '@spryker-oryx/injector';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { isObservable, Observable, Subscription } from 'rxjs';

interface ObservablesData {
  observable$: Observable<unknown>;
  subscription: Subscription | null;
}

export class SubscribeController implements ReactiveController {
  protected subscriptions = new Subscription();
  protected observables = new Map<string, ObservablesData>();
  protected context = resolve(ContextService, null) as ServerContextService;

  constructor(public host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this.context?.rendered$?.subscribe?.(() => this.unsubscribe());
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

    if (this.context?.rendered$) {
      this.subscribe(key);
    }
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
