import { Provider } from '@spryker-oryx/di';
import {
  DefaultCartAdapter,
  DefaultCartService,
  DefaultTotalsService,
  cartAttributesNormalizer,
  cartsItemsNormalizer,
} from '../services-reexports';
import { CartAdapter, CartNormalizer, CartsNormalizer } from './adapter';
import { CartService } from './cart.service';
import { CartResourceResolver } from './resolver';
import { CartTotalsProvider, TotalsService } from './totals';

export const cartNormalizer: Provider[] = [
  {
    provide: CartNormalizer,
    useValue: cartAttributesNormalizer,
  },
];

export const cartsNormalizer: Provider[] = [
  {
    provide: CartsNormalizer,
    useValue: cartsItemsNormalizer,
  },
];

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
];
