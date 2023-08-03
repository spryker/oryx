import {
  CartAdapter,
  CartService,
  DefaultCartService,
  DefaultTotalsService,
  TotalsResolver,
  TotalsService,
} from '@spryker-oryx/cart';
import { Provider } from '@spryker-oryx/di';
import { ExperienceData } from '@spryker-oryx/experience';
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
    provide: ExperienceData,
    useValue: cartTotalsStaticData,
  },
  {
    provide: TotalsService,
    useClass: DefaultTotalsService,
  },
  {
    provide: `${TotalsResolver}CART`,
    useClass: mockedTotals(mockNormalizedCartTotals),
  },
  {
    provide: `${TotalsResolver}CART-NET-MODE`,
    useClass: mockedTotals(mockNormalizedCartTotalsNetMode),
  },
  {
    provide: `${TotalsResolver}CART-SINGLE-DISCOUNT`,
    useClass: mockedTotals(mockNormalizedCartTotalsSingleDiscount),
  },
];
