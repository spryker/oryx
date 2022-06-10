import { Adapter } from '@spryker-oryx/core';
import { Product } from '../../models';
import { ProductQualifier } from '../../models/product-qualifier';

export type ProductAdapter = Adapter<Product, ProductQualifier>;

export const ProductAdapter = 'FES.ProductAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductAdapter]: ProductAdapter;
  }
}
