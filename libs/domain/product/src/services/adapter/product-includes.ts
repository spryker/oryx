import { provideIncludes } from '@spryker-oryx/core';
import { ApiProductModel } from '../../models';
import { ProductIncludes } from './product.adapter';

export const productIncludes = provideIncludes(ProductIncludes, [
  ApiProductModel.Includes.ConcreteProductImageSets,
  ApiProductModel.Includes.ConcreteProductPrices,
  ApiProductModel.Includes.ConcreteProductAvailabilities,
  ApiProductModel.Includes.Labels,
  ApiProductModel.Includes.AbstractProducts,
  {
    include: ApiProductModel.Includes.CategoryNodes,
    fields: [
      ApiProductModel.CategoryNodeFields.MetaDescription,
      ApiProductModel.CategoryNodeFields.NodeId,
      ApiProductModel.CategoryNodeFields.Order,
      ApiProductModel.CategoryNodeFields.Name,
      ApiProductModel.CategoryNodeFields.Parents,
      ApiProductModel.CategoryNodeFields.IsActive,
    ],
  },
]);
