import { ContextService } from '@spryker-oryx/core';
import { ServerContextService } from '@spryker-oryx/core/server';
import { resolve } from '@spryker-oryx/injector';
import { isClient } from '@spryker-oryx/typescript-utils';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { isObservable, Observable, Subscription } from 'rxjs';

export class SubscribeController implements ReactiveController {
  protected subscriptions = new Subscription();
  protected observables = new Set<Observable<unknown>>();
  protected context = resolve(ContextService, null) as ServerContextService;

  constructor(public host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this.context?.rendered$?.subscribe?.(() => this.unsubscribe());
  }

  hostConnected(): void {
    // TODO: check performance
    for (const observable$ of this.observables) {
      this.subscribe(observable$);
    }
  }

  hostDisconnected(): void {
    this.unsubscribe();
  }

  add(observable$: unknown): void {
    if (!isObservable(observable$)) {
      throw `Invalid SubscribeController value: incorrect ${observable$} for SubscribeController, use observable`;
    }

    this.observables.add(observable$);

    if (!isClient) {
      this.subscribe(observable$);
    }
  }

  protected subscribe(observable$: Observable<unknown>): void {
    this.subscriptions.add(observable$.subscribe());
  }

  protected unsubscribe(): void {
    this.subscriptions.unsubscribe();
  }
}
