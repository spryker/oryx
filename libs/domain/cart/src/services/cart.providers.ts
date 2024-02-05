import { TokenResourceResolvers } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { cartCreatePage, cartsPage } from '../presets';
import { CartAdapter, CartNormalizer, CartsNormalizer } from './adapter';
import { cartContextProviders } from './cart-context';
import { CartService } from './cart.service';
import { TotalsResolver, TotalsService } from './totals';

export const TotalsResolverCartToken = `${TotalsResolver}CART`;
export const CartTokenResourceResolverToken = `${TokenResourceResolvers}CART`;

export const cartNormalizer: Provider[] = [
  {
    provide: CartNormalizer,
    useValue: () =>
      import('@spryker-oryx/cart/services').then(
        (m) => m.cartAttributesNormalizer
      ),
  },
];

export const cartsNormalizer: Provider[] = [
  {
    provide: CartsNormalizer,
    useValue: () =>
      import('@spryker-oryx/cart/services').then((m) => m.cartsItemsNormalizer),
  },
];

export const glueCartConnectors: Provider[] = [
  {
    provide: CartAdapter,
    asyncClass: () =>
      import('@spryker-oryx/cart/services').then((m) => m.GlueCartAdapter),
  },
  ...cartNormalizer,
  ...cartsNormalizer,
];

export const mockCartConnectors: Provider[] = [
  {
    provide: CartAdapter,
    asyncClass: () =>
      import('@spryker-oryx/cart/services').then((m) => m.MockCartAdapter),
  },
];

export const cartProviders: Provider[] = [
  {
    provide: CartService,
    asyncClass: () =>
      import('@spryker-oryx/cart/services').then((m) => m.DefaultCartService),
  },
  {
    provide: TotalsService,
    asyncClass: () =>
      import('@spryker-oryx/cart/services').then((m) => m.DefaultTotalsService),
  },
  {
    provide: CartTokenResourceResolverToken,
    asyncClass: () =>
      import('@spryker-oryx/cart/services').then((m) => m.CartResolver),
  },
  {
    provide: TotalsResolverCartToken,
    asyncClass: () =>
      import('@spryker-oryx/cart/services').then((m) => m.CartTotalsResolver),
  },
  ...cartContextProviders,
  provideExperienceData([cartsPage, cartCreatePage]),
];

export const glueCartProviders: Provider[] = [
  ...glueCartConnectors,
  ...cartProviders,
];

export const mockCartProviders: Provider[] = [
  ...mockCartConnectors,
  ...cartProviders,
];
