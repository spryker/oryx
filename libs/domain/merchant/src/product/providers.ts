import { Provider } from '@spryker-oryx/di';
import {
  ProductContextSerializerToken,
  ProductNormalizer,
} from '@spryker-oryx/product';
import { ProductWithOfferContextSerializer } from './product-context';
import { productOfferNormalizer } from './product.normalizer';
import { productOfferQueries } from './query';

export const merchantProductProviders: Provider[] = [
  {
    provide: ProductNormalizer,
    useValue: productOfferNormalizer,
  },
  {
    provide: ProductContextSerializerToken,
    useClass: ProductWithOfferContextSerializer,
  },
  ...productOfferQueries,
];
