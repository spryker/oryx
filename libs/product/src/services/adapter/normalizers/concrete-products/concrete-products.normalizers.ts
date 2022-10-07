import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/typescript-utils';
import { combineLatest, Observable } from 'rxjs';
import { ApiProductModel, Product } from '../../../../models';
import { ProductNormalizers } from '../product';
import { DeserializedAbstract } from './model';

export const ConcreteProductsNormalizers = 'FES.ConcreteProductsNormalizers';

export function concreteProductsNormalizer(
  data: DeserializedAbstract[],
  transformer: TransformerService
): Observable<Product[]> {
  const concreteProductsKey = camelize(
    ApiProductModel.Includes.ConcreteProducts
  );

  return combineLatest(
    data
      .map((abstract) => abstract[concreteProductsKey])
      .flat()
      .map((concrete) => transformer.transform(concrete, ProductNormalizers))
  );
}

export const concreteProductsNormalizers = [concreteProductsNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [ConcreteProductsNormalizers]: Transformer<Product[]>[];
  }
}
