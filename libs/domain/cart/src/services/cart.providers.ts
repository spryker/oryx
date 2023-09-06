import { Provider } from '@spryker-oryx/di';
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
  CartResourceResolver,
  CartTotalsProvider,
  ...cartNormalizer,
  ...cartsNormalizer,
  // {
  //   provide: HttpInterceptor,
  //   useClass: CartVersionInterceptor,
  // },
];
