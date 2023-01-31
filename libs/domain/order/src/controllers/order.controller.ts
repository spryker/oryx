import { ContextController } from '@spryker-oryx/core';
import { ObserveController } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map, Observable, shareReplay } from 'rxjs';
import { OrderComponentProperties, OrderContext } from '../models';

export class OrderController {
  protected context: ContextController;
  protected observe: ObserveController<LitElement & OrderComponentProperties>;

  constructor(
    protected host: LitElement & OrderComponentProperties,
    protected include: string[] = []
  ) {
    this.observe = new ObserveController(host);
    this.context = new ContextController(host);
  }

  getRef(): Observable<string | null> {
    return this.context
      .get(OrderContext.OrderId, this.observe.get('order-id'))
      .pipe(
        map((id) => id ?? null),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
  }
}
