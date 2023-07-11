import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { combineLatest, map, Observable } from 'rxjs';
import { ApiProductModel, Product } from '../../../../models';
import { NodeNormalizer } from '../node';
import { ProductNormalizer } from '../product';
import { DeserializedAbstract } from './model';

export const ConcreteProductsNormalizer = 'oryx.ConcreteProductsNormalizer*';

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
          transformer.transform(abstract[categoryKey], NodeNormalizer),
        ]).pipe(map(([product, nodeId]) => ({ ...product, ...nodeId })))
      )
  );
}

declare global {
  interface InjectionTokensContractMap {
    [ConcreteProductsNormalizer]: Transformer<Product[]>[];
  }
}
