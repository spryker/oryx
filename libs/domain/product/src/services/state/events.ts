import { QueryEvent } from '@spryker-oryx/core';
import { ProductList, ProductListQualifier } from '../../models';

export const ProductsLoaded = 'ProductsLoaded';

export type ProductsLoaded = QueryEvent<ProductList, ProductListQualifier>;
