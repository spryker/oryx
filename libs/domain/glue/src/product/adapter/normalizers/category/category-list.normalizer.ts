import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { CategoriesLoaded } from '@spryker-oryx/product';
import { ApiProductModel } from '../../../models';
import { flattenCategoryNodes } from './category-tree.normalizer';

export const categoryListNormalizerFactory =
  (queryService = inject(QueryService)) =>
  (data?: ApiProductModel.CategoryNodes[]): object => {
    const categories = flattenCategoryNodes(data ?? []);

    if (categories?.length) {
      queryService.emit({ type: CategoriesLoaded, data: categories });
    }

    return {};
  };
