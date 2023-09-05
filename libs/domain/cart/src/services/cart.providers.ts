import { Provider } from '@spryker-oryx/di';
import { PriceModeChangeGuard } from '@spryker-oryx/site';
import { CartPriceModeChangeGuard } from '../guards/cart-price.guard';
import {
  CartAdapter,
  DefaultCartAdapter,
  cartNormalizer,
  cartsNormalizer,
} from './adapter';
import { CartService } from './cart.service';
import { DefaultCartService } from './default-cart.service';
import { CartResourceResolver } from './resolver';
import {
  CartTotalsProvider,
  DefaultTotalsService,
  TotalsService,
} from './totals';

export const cartProviders: Provider[] = [
  {
    provide: CartAdapter,
    useClass: DefaultCartAdapter,
  },
  {
    provide: CartService,
    useClass: DefaultCartService,
  },
  {
    provide: TotalsService,
    useClass: DefaultTotalsService,
  },
  {
    provide: PriceModeChangeGuard,
    useClass: CartPriceModeChangeGuard,
  },
  CartResourceResolver,
  CartTotalsProvider,
  ...cartNormalizer,
  ...cartsNormalizer,
  // {
  //   provide: HttpInterceptor,
  //   useClass: CartEtagInterceptor,
  // },
];
