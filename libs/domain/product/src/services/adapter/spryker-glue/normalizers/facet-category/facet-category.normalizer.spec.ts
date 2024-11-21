import { facetCategoryNormalizer } from './facet-category.normalizer';

const categoryFacet = {
  activeValue: '10',
  config: { parameterName: 'category', isMultiValued: false },
  docCount: null,
  localizedName: 'Categories',
  name: 'category',
  values: [
    {
      value: 10,
      docCount: 30,
    },
    { value: 9, docCount: 30 },
  ],
};

const mockCategoryTreeFilter = [
  {
    nodeId: 9,
    name: 'Smart Wearables',
    docCount: 30,
    children: [
      {
        nodeId: 10,
        name: 'Smartwatches',
        docCount: 30,
        children: [],
      },
    ],
  },
];

describe('Product Facet Normalizers', () => {
  it('should return normalized product facet-navigation', () => {
    expect(
      facetCategoryNormalizer({
        categoryFacet,
        categoryTreeFilter: mockCategoryTreeFilter,
      })
    ).toEqual({
      type: 'single',
      multiValued: false,
      name: 'Categories',
      parameter: 'category',
      selectedValues: ['10'],
      valuesTreeLength: 1,
      values: [
        {
          value: 9,
          name: 'Smart Wearables',
          count: 30,
          selected: false,
          children: [
            {
              value: 10,
              name: 'Smartwatches',
              count: 30,
              children: [],
              selected: true,
            },
          ],
        },
      ],
    });
  });
});
