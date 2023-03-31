import {
  CartAdapter,
  CartService,
  DefaultCartService,
} from '@spryker-oryx/cart';
import { Provider } from '@spryker-oryx/di';
import { ExperienceStaticData } from '@spryker-oryx/experience';
import { cartTotalsStaticData } from './cart-totals';
import { MockCartAdapter } from './mock-cart.adapter';

export const mockCartProviders: Provider[] = [
  {
    provide: CartAdapter,
    useClass: MockCartAdapter,
  },
  {
    provide: CartService,
    useClass: DefaultCartService,
  },
  {
    provide: ExperienceStaticData,
    useValue: cartTotalsStaticData,
  },
];
