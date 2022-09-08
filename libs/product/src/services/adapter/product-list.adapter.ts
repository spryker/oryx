import { Adapter } from '@spryker-oryx/core';
import { ProductList } from '@spryker-oryx/product';
import { ProductListQualifier } from '../../models/product-list-qualifier';

export type ProductListAdapter = Adapter<ProductList, ProductListQualifier>;

export const ProductListAdapter = 'FES.ProductListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ProductListAdapter]: ProductListAdapter;
  }
}
