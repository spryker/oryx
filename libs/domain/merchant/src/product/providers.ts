import { FieldsContextSerializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ProductContextSerializerToken,
  ProductNormalizer,
  ProductTokenResourceResolverToken,
} from '@spryker-oryx/product';
import { productOfferQueries } from './query';

export const merchantProductProviders: Provider[] = [
  {
    provide: ProductNormalizer,
    useValue: () =>
      import('@spryker-oryx/merchant/services').then(
        (m) => m.productOfferNormalizer
      ),
  },
  {
    provide: ProductContextSerializerToken,
    useFactory: () => new FieldsContextSerializer(['sku', 'offer']),
  },
  ...productOfferQueries,
  {
    provide: ProductTokenResourceResolverToken,
    asyncClass: () =>
      import('@spryker-oryx/merchant/services').then((m) => m.OfferResolver),
  },
];
