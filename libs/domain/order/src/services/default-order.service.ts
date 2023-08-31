import { IdentityService } from '@spryker-oryx/auth';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { OrderData, orderStorageKey } from '../models';
import { GetOrderDataProps, OrderAdapter } from './adapter';
import { OrderService } from './order.service';

export class DefaultOrderService implements OrderService {
  protected orders$ = new Map<string, Observable<OrderData | null>>(null);

  constructor(
    protected adapter = inject(OrderAdapter),
    protected identity = inject(IdentityService),
    protected storage = inject(StorageService)
  ) {}

  get(data: GetOrderDataProps): Observable<OrderData | null> {
    return this.identity.get().pipe(
      switchMap((user) => {
        const { id } = data;
        if (!user.isAuthenticated || !id) {
          return this.getLastOrder().pipe(
            map((lastOrder) =>
              lastOrder?.userId === user.userId && lastOrder?.id === id
                ? lastOrder
                : null
            ),
            tap((lastOrder) => {
              if (!lastOrder) {
                this.clearLastOrder();
              }
            })
          );
        }
        if (!this.orders$.has(id)) {
          this.orders$.set(
            id,
            this.identity.get().pipe(
              switchMap(() => this.adapter.get({ id })),
              catchError(() => of(null)),
              shareReplay({ bufferSize: 1, refCount: true })
            )
          );
        }
        this.clearLastOrder();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.orders$.get(id)!;
      })
    );
  }

  getLastOrder(): Observable<OrderData | null> {
    return this.storage.get<OrderData>(orderStorageKey, StorageType.Session);
  }

  storeLastOrder(order: OrderData, userId: string): void {
    // For privacy reasons, we cannot store the address in session storage.
    const { billingAddress, shippingAddress, ...sanitized } = order;
    this.storage.set(
      orderStorageKey,
      { ...sanitized, userId },
      StorageType.Session
    );
  }

  clearLastOrder(): void {
    this.storage.remove(orderStorageKey, StorageType.Session);
  }
}
