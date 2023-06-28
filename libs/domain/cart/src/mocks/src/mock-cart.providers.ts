import {
  CartAdapter,
  CartService,
  DefaultCartService,
  DefaultTotalsService,
  TotalsContextFallback,
  TotalsService,
  TotalsServiceProvider,
} from '@spryker-oryx/cart';
import { Provider } from '@spryker-oryx/di';
import { ExperienceStaticData } from '@spryker-oryx/experience';
import { cartTotalsStaticData, mockedTotals } from './cart-totals';
import {
  mockNormalizedCartTotals,
  mockNormalizedCartTotalsNetMode,
  mockNormalizedCartTotalsSingleDiscount,
} from './mock-cart';
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
  {
    provide: TotalsService,
    useClass: DefaultTotalsService,
  },
  {
    provide: `${TotalsServiceProvider}CART`,
    useClass: mockedTotals(mockNormalizedCartTotals),
  },
  {
    provide: `${TotalsServiceProvider}CART-NET-MODE`,
    useClass: mockedTotals(mockNormalizedCartTotalsNetMode),
  },
  {
    provide: `${TotalsServiceProvider}CART-SINGLE-DISCOUNT`,
    useClass: mockedTotals(mockNormalizedCartTotalsSingleDiscount),
  },
  TotalsContextFallback
];
