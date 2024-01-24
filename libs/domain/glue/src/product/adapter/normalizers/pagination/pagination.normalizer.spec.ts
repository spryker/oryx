import { ApiProductListModel } from '../../../models/product-list.api.model';
import { paginationNormalizer } from './pagination.normalizer';
import Pagination = ApiProductListModel.Pagination;

const pagination: Pagination = {
  numFound: 100,
  currentPage: 1,
  currentItemsPerPage: 20,
  maxPage: 5,
  config: {
    parameterName: 'name',
    itemsPerPageParameterName: '21',
    defaultItemsPerPage: 12,
    validItemsPerPageOptions: [12, 24, 36],
  },
};

describe('Product Pagination Normalizers', () => {
  it('should return normalized product pagination', () => {
    expect(paginationNormalizer(pagination)).toEqual({
      numFound: 100,
      currentPage: 1,
      itemsPerPage: 20,
      maxPage: 5,
    });
  });
});
