import { ConcreteProductsNormalizer } from '@spryker-oryx/product';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { DeserializedProductList } from './model';
import {
  concreteProductNormalizer,
  productFacetsNormalizer,
} from './product-list.normalizer';

const mockDeserializedProductList = {
  abstractProducts: [],
};

const mockFacets = {
  valueFacets: [
    {
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
    },
  ],
  rangeFacets: [
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

const mockTransformer = {
  transform: vi.fn(),
  do: vi.fn(),
};

describe('Product Catalog Normalizers', () => {
  it('should call transformers and return products', () => {
    const mockProductsResult = 'mockProductsResult';
    mockTransformer.transform.mockReturnValue(of(mockProductsResult));
    concreteProductNormalizer([mockDeserializedProductList], mockTransformer)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toEqual({
          products: mockProductsResult,
        });
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockDeserializedProductList.abstractProducts,
          ConcreteProductsNormalizer
        );
      });
  });

  it('should return normalized product facets', () => {
    mockTransformer.transform.mockReturnValue(of(mockFacets));
    productFacetsNormalizer([
      {
        ...mockDeserializedProductList,
        ...mockFacets,
        categoryTreeFilter: mockCategoryTreeFilter,
      } as DeserializedProductList,
    ])
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toEqual({
          facets: [
            {
              name: 'Categories',
              parameter: 'category',
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
            },
            {
              parameter: 'price',
              name: 'Price range',
              count: 2,
              values: {
                max: 36660,
                min: 175,
                selected: {
                  max: 36660,
                  min: 175,
                },
              },
            },
          ],
        });
      });
  });
});
