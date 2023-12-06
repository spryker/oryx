import { provideIncludes } from '@spryker-oryx/core';
import { ProductResource } from '@spryker-oryx/product';
import { ApiProductModel } from '../../../models';
import { ProductListResource } from './product-list.adapter';

export const productListIncludes = provideIncludes(
  ProductListResource,
  [ApiProductModel.Includes.ConcreteProducts],
  ProductResource
);
