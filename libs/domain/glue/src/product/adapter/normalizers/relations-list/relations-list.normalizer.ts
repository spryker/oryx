import { TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Observable, combineLatest } from 'rxjs';

import {
  Product,
  ProductNormalizer,
  RelationsListNormalizer,
} from '@spryker-oryx/product';
import { DeserializedProductListIncludes } from '../model';

export function listNormalizer(
  data: DeserializedProductListIncludes[],
  transformer: TransformerService
): Observable<Product[]> {
  return combineLatest(
    data.map((product) => transformer.transform(product, ProductNormalizer))
  );
}

export const relationsListNormalizer: Provider[] = [
  {
    provide: RelationsListNormalizer,
    useValue: listNormalizer,
  },
];
