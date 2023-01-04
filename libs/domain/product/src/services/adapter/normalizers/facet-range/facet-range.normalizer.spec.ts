import { facetsRangeNormalizer } from './facet-range.normalizer';

const mockRangeFacets = [
  {
    activeMax: 36660,
    activeMin: 175,
    config: { parameterName: 'price', isMultiValued: false },
    docCount: 2,
    localizedName: 'Price range',
    max: 36660,
    min: 175,
    name: 'price-DEFAULT-EUR-GROSS_MODE',
  },
];

describe('Product Facet Normalizers', () => {
  it('should return normalized product facet-navigation', () => {
    expect(facetsRangeNormalizer(mockRangeFacets)).toEqual([
      {
        parameter: 'price',
        name: 'Price range',
        selectedValue: [],
        values: {
          max: 36660,
          min: 175,
          selected: {
            max: 36660,
            min: 175,
          },
        },
      },
    ]);
  });
});
