import { TotalsResolver } from '@spryker-oryx/cart';
import {
  mockedTotals,
  mockNormalizedCartTotals,
} from '@spryker-oryx/cart/mocks';
import { Provider } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { MockOrderService } from './mock-order.service';

export const mockOrderProviders: Provider[] = [
  {
    provide: OrderService,
    useClass: MockOrderService,
  },
  {
    provide: `${TotalsResolver}ORDER`,
    useClass: mockedTotals(mockNormalizedCartTotals),
  },
];
