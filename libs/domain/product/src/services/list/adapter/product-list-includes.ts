import { provideIncludes } from '@spryker-oryx/core';
import { ApiProductModel } from '../../../models';
import { ProductResource } from '../../adapter/product.adapter';
import { ProductListResource } from './product-list.adapter';

export const productListIncludes = provideIncludes(
  ProductListResource,
  [ApiProductModel.Includes.ConcreteProducts],
  ProductResource
);
