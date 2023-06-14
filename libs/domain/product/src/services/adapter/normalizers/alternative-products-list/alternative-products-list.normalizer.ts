import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  DeserializedProductListIncludes,
  Product,
  ProductNormalizer,
} from '@spryker-oryx/product';
import { combineLatest, Observable } from 'rxjs';

export const AlternativeProductsListNormalizer =
  'oryx.AlternativeProductsListNormalizer*';

export function listNormalizer(
  data: DeserializedProductListIncludes[],
  transformer: TransformerService
): Observable<Product[]> {
  return combineLatest(
    data.map((product) => transformer.transform(product, ProductNormalizer))
  );
}

export const alternativeProductsListNormalizer: Provider[] = [
  {
    provide: AlternativeProductsListNormalizer,
    useValue: listNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [AlternativeProductsListNormalizer]: Transformer<Product[]>[];
  }
}
