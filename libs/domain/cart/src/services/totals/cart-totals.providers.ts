import { Provider } from '@spryker-oryx/di';
import { CartService } from '../cart.service';
import { TotalsResolver } from './totals.service';

export const CartTotalsProvider: Provider = {
  provide: `${TotalsResolver}CART`,
  useExisting: CartService,
};
