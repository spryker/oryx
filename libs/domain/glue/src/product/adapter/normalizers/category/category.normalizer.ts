import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { CategoriesLoaded, ProductCategory } from '@spryker-oryx/product';
import { ApiProductModel } from '../../../models';
import { categoryNodeNormalizer } from './category-node.normalizer';

export const categoryNormalizerFactory =
  (queryService = inject(QueryService)) =>
  (data?: ApiProductModel.CategoryNodes[]): object => {
    const categories = data?.map<ProductCategory>(categoryNodeNormalizer);

    if (categories?.length) {
      queryService.emit({ type: CategoriesLoaded, data: categories });
    }

    return {};
  };
