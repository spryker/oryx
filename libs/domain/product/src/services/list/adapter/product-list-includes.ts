import { provideIncludes } from '@spryker-oryx/core';
import { ProductIncludes } from '@spryker-oryx/product';
import { ApiProductModel } from '../../../models';
import { ProductListIncludes } from './product-list.adapter';

export const productListIncludes = provideIncludes(
  ProductListIncludes,
  [ApiProductModel.Includes.ConcreteProducts],
  ProductIncludes
);
