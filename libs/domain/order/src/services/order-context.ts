import { ContextServiceFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map } from 'rxjs';

export const enum OrderContext {
  OrderId = 'orderId',
}

export const OrderContextFallback: Provider = {
  provide: `${ContextServiceFallback}${OrderContext.OrderId}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(map((params) => params?.id)),
};
