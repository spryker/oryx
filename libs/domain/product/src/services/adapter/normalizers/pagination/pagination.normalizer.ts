import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, Pagination } from '@spryker-oryx/product';

export const PaginationNormalizer = 'FES.PaginationNormalizer*';

export function paginationNormalizer(
  data: ApiProductListModel.Pagination
): Pagination {
  const { maxPage, currentItemsPerPage, currentPage, numFound } = data;

  console.log('maxPage', maxPage);
  return {
    itemsPerPage: currentItemsPerPage,
    currentPage,
    maxPage,
    numFound,
  };
}

declare global {
  interface InjectionTokensContractMap {
    [PaginationNormalizer]: Transformer<Pagination>[];
  }
}
