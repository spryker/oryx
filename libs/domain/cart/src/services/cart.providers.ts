import { TokenResourceResolvers } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import {
  CartResolver,
  CartTotalsResolver,
  DefaultCartAdapter,
  DefaultCartService,
  DefaultTotalsService,
  cartAttributesNormalizer,
  cartsItemsNormalizer,
} from '../services-reexports';
import { CartAdapter, CartNormalizer, CartsNormalizer } from './adapter';
import { CartService } from './cart.service';
import { TotalsResolver, TotalsService } from './totals';

export const cartNormalizer: Provider[] =
  featureVersion < '1.2'
    ? [
        {
          provide: CartNormalizer,
          useValue: cartAttributesNormalizer,
        },
      ]
    : [
        {
          provide: CartNormalizer,
          useValue: () =>
            import('@spryker-oryx/cart/services').then(
              (m) => m.cartAttributesNormalizer
            ),
        },
      ];

export const cartsNormalizer: Provider[] =
  featureVersion < '1.2'
    ? [
        {
          provide: CartsNormalizer,
          useValue: cartsItemsNormalizer,
        },
      ]
    : [
        {
          provide: CartsNormalizer,
          useValue: () =>
            import('@spryker-oryx/cart/services').then(
              (m) => m.cartsItemsNormalizer
            ),
        },
      ];

/** @deprecated since 1.2 */
export const CartResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}CART`,
  useClass: CartResolver,
};

/** @deprecated since 1.2 */
export const CartTotalsProvider: Provider = {
  provide: `${TotalsResolver}CART`,
  useClass: CartTotalsResolver,
};

export const cartProviders: Provider[] =
  featureVersion < '1.2'
    ? [
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
      ]
    : [
        {
          provide: CartAdapter,
          asyncClass: () =>
            import('@spryker-oryx/cart/services').then(
              (m) => m.DefaultCartAdapter
            ),
        },
        {
          provide: CartService,
          asyncClass: () =>
            import('@spryker-oryx/cart/services').then(
              (m) => m.DefaultCartService
            ),
        },
        ...cartNormalizer,
        ...cartsNormalizer,
        {
          provide: TotalsService,
          asyncClass: () =>
            import('@spryker-oryx/cart/services').then(
              (m) => m.DefaultTotalsService
            ),
        },
        {
          provide: `${TokenResourceResolvers}CART`,
          asyncClass: () =>
            import('@spryker-oryx/cart/services').then((m) => m.CartResolver),
        },
        {
          provide: `${TotalsResolver}CART`,
          asyncClass: () =>
            import('@spryker-oryx/cart/services').then(
              (m) => m.CartTotalsResolver
            ),
        },
      ];
