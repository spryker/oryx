import { snakify } from '@spryker-oryx/core/utilities';
import { ProductListSort } from '@spryker-oryx/product';
import { ApiProductListModel } from '../../../models/product-list.api.model';

export function sortNormalizer(
  sort: ApiProductListModel.Sort
): ProductListSort {
  const { currentSortParam, currentSortOrder, sortParamLocalizedNames } = sort;

  return {
    sortOrder: currentSortOrder,
    sortParam: currentSortParam,
    sortValues: Object.entries(sortParamLocalizedNames).map(
      ([sortKey, sortName]) => ({
        sortKey: snakify(sortKey),
        sortName,
      })
    ),
  };
}
