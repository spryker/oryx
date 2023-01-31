import { IdentityService } from '@spryker-oryx/auth';
import { inject } from '@spryker-oryx/di';
import { catchError, Observable, of, shareReplay, switchMap } from 'rxjs';
import { OrderData } from '../models';
import { GetOrderDataProps, OrderAdapter } from './adapter';
import { OrderService } from './order.service';

export class DefaultOrderService implements OrderService {
  protected orders$ = new Map<string, Observable<OrderData | null>>(null);

  constructor(
    protected adapter = inject(OrderAdapter),
    protected identity = inject(IdentityService)
  ) {}

  get(data: GetOrderDataProps): Observable<OrderData | null> {
    const { id } = data;
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
    return this.orders$.get(id)!;
  }
}
