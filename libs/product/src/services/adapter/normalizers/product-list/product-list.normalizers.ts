import { Transformer, TransformerService } from '@spryker-oryx/core';
import {
  ApiProductModel,
  ConcreteProductsNormalizers,
  ProductList,
} from '@spryker-oryx/product';
import { camelize } from '@spryker-oryx/typescript-utils';
import { map, Observable } from 'rxjs';
import { DeserializedProductList } from './model';

export const ProductListNormalizers = 'FES.ProductListNormalizers';

export function productNormalizer(
  data: DeserializedProductList[],
  transformer: TransformerService
): Observable<ProductList> {
  const abstractKey = camelize(ApiProductModel.Includes.AbstractProducts);
  const { [abstractKey]: products } = data[0];

  return transformer
    .transform(products, ConcreteProductsNormalizers)
    .pipe(map((products) => ({ products })));
}

export const productListNormalizers = [productNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [ProductListNormalizers]: Transformer<ProductList>[];
  }
}
