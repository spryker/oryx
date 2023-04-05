import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, of, switchMap, take } from 'rxjs';
import { ApiOrderModel, OrderData } from '../../models';
import { OrderNormalizer } from './normalizers';
import { GetOrderDataProps, OrderAdapter } from './order.adapter';

export class DefaultOrderAdapter implements OrderAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected identity = inject(IdentityService)
  ) {}

  get(data: GetOrderDataProps): Observable<OrderData | null> {
    return this.identity.get().pipe(
      take(1),
      switchMap((identity) => {
        return !identity.isAuthenticated
          ? of(null)
          : this.http
              .get<ApiOrderModel.Response>(
                `${this.SCOS_BASE_URL}/orders/${data.id}`
              )
              .pipe(this.transformer.do(OrderNormalizer));
      })
    );
  }
}
