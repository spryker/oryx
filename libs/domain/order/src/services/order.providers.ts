import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { featureVersion } from '@spryker-oryx/utilities';
import { DefaultOrderAdapter, OrderAdapter } from './adapter';
import { orderNormalizer } from './adapter/normalizers';
import { DefaultOrderService } from './default-order.service';
import { OrderContextFallback } from './order-context';
import { orderRoutes } from './order.routes';
import { OrderService } from './order.service';
import { OrderTotalsProvider } from './totals';

export const orderProviders = [
  {
    provide: OrderService,
    useClass: DefaultOrderService,
  },
  {
    provide: OrderAdapter,
    useClass: DefaultOrderAdapter,
  },
  OrderTotalsProvider,
  ...orderNormalizer,
  OrderContextFallback,
  ...(featureVersion >= '1.4' ? [] : provideLitRoutes({ routes: orderRoutes })),
];
