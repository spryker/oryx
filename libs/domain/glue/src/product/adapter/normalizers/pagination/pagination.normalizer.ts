import { Pagination } from '@spryker-oryx/product';
import { ApiProductListModel } from '../../../models/product-list.api.model';

export function paginationNormalizer(
  data: ApiProductListModel.Pagination
): Pagination {
  const { maxPage, currentItemsPerPage, currentPage, numFound } = data;

  return {
    itemsPerPage: currentItemsPerPage,
    currentPage,
    maxPage,
    numFound,
  };
}
