/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { isObservable, Observable, Subscription } from 'rxjs';

export class SubscribeController implements ReactiveController {
  protected subscriptions = new Subscription();
  protected properties: Set<string> = new Set();

  constructor(
    public host: ReactiveControllerHost & Record<string, any>,
    propNames?: string | string[]
  ) {
    (this.host = host).addController(this);

    if (propNames) {
      this.add(propNames);
    }
  }

  hostConnected(): void {
    for (const property of this.properties) {
      this.subscribe(this.host[property]);
    }
  }

  hostDisconnected(): void {
    this.subscriptions.unsubscribe();
  }

  add(propNames: string | string[]): void {
    const propNameArray = Array.isArray(propNames) ? propNames : [propNames];

    for (const propName of propNameArray) {
      this.properties.add(propName);
    }
  }

  protected subscribe(observable: Observable<unknown>): void {
    if (!isObservable(observable)) {
      throw `Invalid SubscribeController value: incorrect ${observable} for SubscribeController, use observable`;
    }

    this.subscriptions.add(observable.subscribe());
  }
}
