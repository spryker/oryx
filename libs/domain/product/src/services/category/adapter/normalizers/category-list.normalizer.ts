import { QueryService, Transformer } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ApiProductModel } from '../../../../models';
import { CategoriesLoaded } from '../../state';
import { flattenCategoryNodes } from './category-tree.normalizer';

export const CategoryListNormalizer = 'oryx.CategoryListNormalizer';

export const categoryListNormalizerFactory =
  (queryService = inject(QueryService)) =>
  (data?: ApiProductModel.CategoryNodes[]): object => {
    const categories = flattenCategoryNodes(data ?? []);

    if (categories?.length) {
      queryService.emit({ type: CategoriesLoaded, data: categories });
    }

    return {};
  };

declare global {
  interface InjectionTokensContractMap {
    [CategoryListNormalizer]: Transformer<object>[];
  }
}
