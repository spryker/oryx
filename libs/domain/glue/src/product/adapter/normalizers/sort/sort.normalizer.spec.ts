import { ApiProductListModel } from '../../../models/product-list.api.model';
import { sortNormalizer } from './sort.normalizer';

const sort = {
  sortParamNames: [
    'rating',
    'name_asc',
    'name_desc',
    'price_asc',
    'price_desc',
    'popularity',
  ],
  sortParamLocalizedNames: {
    rating: 'Sort by product ratings',
    name_asc: 'Sort by name ascending',
    name_desc: 'Sort by name descending',
    price_asc: 'Sort by price ascending',
    price_desc: 'Sort by price descending',
    popularity: 'Sort by popularity',
  },
  currentSortParam: null,
  currentSortOrder: null,
};

describe('Product Sorting Normalizers', () => {
  it('should return normalized product sorting', () => {
    expect(sortNormalizer(sort as unknown as ApiProductListModel.Sort)).toEqual(
      {
        sortOrder: null,
        sortParam: null,
        sortValues: [
          {
            sortKey: 'rating',
            sortName: 'Sort by product ratings',
          },
          {
            sortKey: 'name_asc',
            sortName: 'Sort by name ascending',
          },
          {
            sortKey: 'name_desc',
            sortName: 'Sort by name descending',
          },
          {
            sortKey: 'price_asc',
            sortName: 'Sort by price ascending',
          },
          {
            sortKey: 'price_desc',
            sortName: 'Sort by price descending',
          },
          {
            sortKey: 'popularity',
            sortName: 'Sort by popularity',
          },
        ],
      }
    );
  });
});
