import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { DefaultOrderAdapter, OrderAdapter } from './adapter';
import { orderNormalizer } from './adapter/normalizers';
import { DefaultOrderService } from './default-order.service';
import {
  DefaultGuestStorageInitializer,
  GuestStorageInitializer,
} from './initializers';
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
  {
    provide: GuestStorageInitializer,
    useClass: DefaultGuestStorageInitializer,
  },
  OrderTotalsProvider,
  ...orderNormalizer,
  OrderContextFallback,
  ...provideLitRoutes({ routes: orderRoutes }),
];
