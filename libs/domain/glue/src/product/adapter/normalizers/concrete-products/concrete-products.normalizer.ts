import { TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Observable, combineLatest, map } from 'rxjs';

import {
  CategoryIdNormalizer,
  Product,
  ProductNormalizer,
} from '@spryker-oryx/product';
import { ApiProductModel } from '../../../models/product.api.model';
import { DeserializedAbstract } from './model';

export function concreteProductsNormalizer(
  data: DeserializedAbstract[],
  transformer: TransformerService
): Observable<Product[]> {
  const concreteProductsKey = camelize(
    ApiProductModel.Includes.ConcreteProducts
  );
  const categoryKey = camelize(ApiProductModel.Includes.CategoryNodes);

  return combineLatest(
    data
      .filter((abstract) => abstract[concreteProductsKey]?.length)
      .map((abstract) =>
        combineLatest([
          transformer.transform(
            abstract[concreteProductsKey]?.[0],
            ProductNormalizer
          ),
          transformer.transform(abstract[categoryKey], CategoryIdNormalizer),
        ]).pipe(
          map(([product, nodeId]) => ({
            ...product,
            ...nodeId,
          }))
        )
      )
  );
}
