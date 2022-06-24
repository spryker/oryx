import { ContextService } from '@spryker-oryx/core';
import { ServerContextService } from '@spryker-oryx/core/server';
import { resolve } from '@spryker-oryx/injector';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { isObservable, Subscription } from 'rxjs';

export class SubscribeController implements ReactiveController {
  protected subscriptions = new Subscription();
  protected context = resolve(
    this,
    ContextService,
    null
  ) as ServerContextService;

  constructor(public host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this.context?.rendered$?.subscribe?.(() => this.unsubscribe());
  }

  hostDisconnected(): void {
    this.unsubscribe();
  }

  add(observable$: unknown): void {
    if (!isObservable(observable$)) {
      throw `Invalid SubscribeController value: incorrect ${observable$} for SubscribeController, use observable`;
    }

    this.subscriptions.add(observable$.subscribe());
  }

  protected unsubscribe(): void {
    this.subscriptions.unsubscribe();
  }
}
