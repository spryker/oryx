import { QueryEvent } from '@spryker-oryx/core';
import {
  Product,
  ProductList,
  ProductListQualifier,
  ProductQualifier,
} from '../../models';

export const ProductLoaded = 'ProductLoaded';
export const ProductsLoaded = 'ProductsLoaded';

export type ProductsLoaded = QueryEvent<ProductList, ProductListQualifier>;
export type ProductLoaded = QueryEvent<Product, ProductQualifier>;
