import { Adapter } from '@spryker-oryx/core';
import { ProductList, ProductListQualifier } from '../../models';

export type ProductListAdapter = Adapter<ProductList, ProductListQualifier>;

export const ProductListAdapter = 'FES.ProductListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductListAdapter]: ProductListAdapter;
  }
}
