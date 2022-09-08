import { Adapter } from '@spryker-oryx/core';
import { Product, ProductQualifier } from '../../models';

export type ProductAdapter = Adapter<Product, ProductQualifier>;

export const ProductAdapter = 'FES.ProductAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductAdapter]: ProductAdapter;
  }
}
