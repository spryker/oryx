import { DefaultOrderAdapter, OrderAdapter } from './adapter';
import { orderNormalizer } from './adapter/normalizers';
import { componentsProvider } from './components.provider';
import { DefaultOrderService } from './default-order.service';
import { OrderService } from './order.service';

export const orderProviders = [
  componentsProvider,
  {
    provide: OrderService,
    useClass: DefaultOrderService,
  },
  {
    provide: OrderAdapter,
    useClass: DefaultOrderAdapter,
  },
  ...orderNormalizer,
];
