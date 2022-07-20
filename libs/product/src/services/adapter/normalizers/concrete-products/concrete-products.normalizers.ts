import { TransformerService } from '@spryker-oryx/core';
import { ProductNormalizers } from '@spryker-oryx/product';
import { combineLatest, Observable } from 'rxjs';
import { Product } from '../../../../models';
import { DeserializedAbstract } from './model';

export const ConcreteProductsNormalizers = 'FES.ConcreteProductsNormalizers';

export function concreteProductsNormalizer(
  data: DeserializedAbstract[],
  transformer: TransformerService
): Observable<Product[]> {
  return combineLatest<Product[]>(
    data
      .map((abstract) => abstract.concreteProducts)
      .flat()
      .map((concrete) => transformer.transform(concrete, ProductNormalizers))
  );
}

export const concreteProductsNormalizers = [concreteProductsNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [ConcreteProductsNormalizers]: Transformer;
  }
}
