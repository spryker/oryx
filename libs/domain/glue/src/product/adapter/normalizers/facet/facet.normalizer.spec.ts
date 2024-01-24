import { ApiProductListModel } from '../../../models/product-list.api.model';
import { facetsNormalizer } from './facet.normalizer';

const mockFacets: ApiProductListModel.ValueFacet[] = [
  {
    name: 'color',
    localizedName: 'Color',
    docCount: null,
    values: [
      {
        value: 'Black',
        docCount: 78,
      },
      {
        value: 'White',
        docCount: 38,
      },
    ],
    activeValue: null,
    config: {
      parameterName: 'color',
      isMultiValued: true,
    },
  },
];

describe('Product Facet Normalizers', () => {
  it('should return normalized product facet-navigation', () => {
    expect(facetsNormalizer({ facetList: mockFacets })).toEqual([
      {
        type: 'multi',
        name: 'Color',
        parameter: 'color',
        values: [
          {
            count: 78,
            selected: false,
            value: 'Black',
          },
          {
            count: 38,
            selected: false,
            value: 'White',
          },
        ],
        selectedValues: undefined,
        valuesTreeLength: 2,
        multiValued: true,
      },
    ]);
  });
});
