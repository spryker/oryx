import { Provider } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { MockOrderService } from './mock-order.service';

export const mockOrderProviders: Provider[] = [
  {
    provide: OrderService,
    useClass: MockOrderService,
  },
];
