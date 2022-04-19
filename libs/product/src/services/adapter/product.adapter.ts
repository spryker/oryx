import { Adapter } from '@spryker-oryx/core';
import { Product } from '../../models/product';
import { ProductDomain } from '../../models/product-domain';
import { ProductQualifier } from '../../models/product-qualifier';

export type ProductAdapter = Adapter<Product, ProductQualifier>;

declare global {
  interface InjectionTokensContractMap {
    [ProductDomain.ProductAdapter]: ProductAdapter;
  }
}
