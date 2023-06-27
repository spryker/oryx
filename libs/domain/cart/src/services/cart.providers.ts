import { Provider } from '@spryker-oryx/di';
import {
  CartAdapter,
  cartNormalizer,
  cartsNormalizer,
  DefaultCartAdapter,
} from './adapter';
import { CartService } from './cart.service';
import { DefaultCartService } from './default-cart.service';
import { CartResourceResolver } from './resolver';
import { CartTotalsProvider } from './totals';

export const cartProviders: Provider[] = [
  {
    provide: CartAdapter,
    useClass: DefaultCartAdapter,
  },
  {
    provide: CartService,
    useClass: DefaultCartService,
  },
  CartResourceResolver,
  CartTotalsProvider,
  ...cartNormalizer,
  ...cartsNormalizer,
];
