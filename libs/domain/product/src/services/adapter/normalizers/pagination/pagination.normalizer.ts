import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, Pagination } from '../../../../models';

export const PaginationNormalizer = 'oryx.PaginationNormalizer*';

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

declare global {
  interface InjectionTokensContractMap {
    [PaginationNormalizer]: Transformer<Pagination>[];
  }
}
