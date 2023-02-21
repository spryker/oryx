import { IdentityService } from '@spryker-oryx/auth';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ObserveController } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import {
  combineLatest,
  defer,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { OrderComponentProperties, OrderData } from '../models';
import { OrderContext, OrderService } from '../services';

export class OrderController {
  protected context: ContextController;
  protected observe: ObserveController<LitElement & OrderComponentProperties>;
  protected identityService = resolve(IdentityService);
  protected orderService = resolve(OrderService);

  protected order$ = defer(() =>
    combineLatest([this.getRef(), this.identityService.get()]).pipe(
      switchMap(([id, user]) => {
        if (user.anonymous || !id) {
          return this.orderService
            .getLastOrder()
            .pipe(map((lastOrder) => lastOrder ?? null));
        }
        if (id) {
          return this.orderService.get({ id });
        }
        return of(null);
      })
    )
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  protected ref$ = defer(() =>
    this.context
      .get(OrderContext.OrderId, this.observe.get('orderId'))
      .pipe(map((id) => id ?? null))
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  constructor(
    protected host: LitElement & OrderComponentProperties,
    protected include: string[] = []
  ) {
    this.observe = new ObserveController(host);
    this.context = new ContextController(host);
  }

  getRef(): Observable<string | null> {
    return this.ref$;
  }

  getOrder(): Observable<OrderData | null> {
    return this.order$;
  }
}
