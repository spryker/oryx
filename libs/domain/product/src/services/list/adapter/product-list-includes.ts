import { provideIncludes } from '@spryker-oryx/core';
import { PRODUCT, PRODUCTS } from '../../../entity';
import { ApiProductModel } from '../../../models';

export const productListIncludes = provideIncludes(
  PRODUCTS,
  [ApiProductModel.Includes.ConcreteProducts],
  PRODUCT
);
