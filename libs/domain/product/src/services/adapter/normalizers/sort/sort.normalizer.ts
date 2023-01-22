import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, ProductListSort } from '../../../../models';

export const SortNormalizer = 'FES.SortNormalizer*';

export function sortNormalizer(
  sort: ApiProductListModel.Sort
): ProductListSort {
  const { currentSortParam, currentSortOrder, sortParamLocalizedNames } = sort;

  return {
    sortOrder: currentSortOrder,
    sortParam: currentSortParam,
    sortValues: Object.entries(sortParamLocalizedNames).map(
      ([sortKey, sortName]) => ({ sortKey, sortName })
    ),
  };
}

declare global {
  interface InjectionTokensContractMap {
    [SortNormalizer]: Transformer<ProductListSort>[];
  }
}
