import { FieldsContextSerializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ProductContextSerializerToken,
  ProductNormalizer,
} from '@spryker-oryx/product';
import { offerResolvers } from '../resolvers/offer.resolver';
import { productOfferNormalizer } from './product.normalizer';
import { productOfferQueries } from './query';

export const merchantProductProviders: Provider[] = [
  {
    provide: ProductNormalizer,
    useValue: productOfferNormalizer,
  },
  {
    provide: ProductContextSerializerToken,
    useFactory: () => new FieldsContextSerializer(['sku', 'offer']),
  },
  ...productOfferQueries,
  ...offerResolvers,
];
