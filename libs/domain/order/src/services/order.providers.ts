import { DefaultOrderAdapter, OrderAdapter } from './adapter';
import { orderNormalizer } from './adapter/normalizers';
import { DefaultOrderService } from './default-order.service';
import { OrderContextFallback } from './order-context';
import { OrderService } from './order.service';
import { OrderResourceResolver } from './resolver';

export const orderProviders = [
  {
    provide: OrderService,
    useClass: DefaultOrderService,
  },
  {
    provide: OrderAdapter,
    useClass: DefaultOrderAdapter,
  },
  OrderResourceResolver,
  ...orderNormalizer,
  OrderContextFallback,
];
