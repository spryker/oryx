import { camelize } from '@spryker-oryx/typescript-utils';
import { ApiModel, Product } from '../../../../models';
import { ImagesNormalizer } from '../images';
import { DeserializedProduct } from '../model';
import { PriceNormalizer } from '../price';
import { productNormalizer } from './product.normalizer';

let mockDeserializedProduct: DeserializedProduct;
const mockTokensData = {
  [PriceNormalizer]: {
    defaultPrice: {
      value: 300,
      isNet: true,
      currency: 'EUR',
    },
  },
  [ImagesNormalizer]: [
    {
      externalUrlLarge: 'externalUrlLarge',
      externalUrlSmall: 'externalUrlSmall',
    },
  ],
};
const mockTransformer = {
  transform: vi
    .fn()
    .mockImplementation((data, token: keyof typeof mockTokensData): unknown => {
      return mockTokensData[token];
    }),
  getTransformers: vi.fn(),
};

describe('Product Normalizer', () => {
  beforeEach(() => {
    mockDeserializedProduct = {
      sku: 'sku',
      name: 'name',
      description: 'description',
      reviewCount: 3,
      averageRating: '5',
      [camelize(ApiModel.INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS)]: [
        {
          imageSets: [
            {
              name: 'test',
              images: [
                {
                  externalUrlLarge: 'externalUrlLarge',
                  externalUrlSmall: 'externalUrlSmall',
                },
              ],
            },
          ],
        },
      ],
      [camelize(ApiModel.INCLUDES.CONCRETE_PRODUCT_PRICES)]: [
        {
          price: 100,
          prices: [
            {
              grossAmount: 300,
              netAmount: 200,
              currency: { code: 'EUR' },
              priceTypeName: 'ORIGINAL' as const,
            },
          ],
        },
      ],
    };
  });

  it('should transform DeserializedProduct into Product', () => {
    const mockResult: Product = {
      sku: mockDeserializedProduct.sku,
      name: mockDeserializedProduct.name,
      description: mockDeserializedProduct.description,
      averageRating: Number(mockDeserializedProduct.averageRating),
      reviewCount: mockDeserializedProduct.reviewCount,
      images: mockTokensData[ImagesNormalizer],
      price: mockTokensData[PriceNormalizer],
    };
    const normalized = productNormalizer[0](
      mockDeserializedProduct,
      mockTransformer
    );
    expect(normalized).toEqual(mockResult);
  });

  it('should call transformers', () => {
    productNormalizer[0](mockDeserializedProduct, mockTransformer);
    expect(mockTransformer.transform).toHaveBeenCalledWith(
      mockDeserializedProduct.concreteProductPrices?.[0],
      PriceNormalizer
    );
    expect(mockTransformer.transform).toHaveBeenCalledWith(
      mockDeserializedProduct.concreteProductImageSets?.[0],
      ImagesNormalizer
    );
  });

  it('should not return `averageRating` as 0 if its falsy', () => {
    delete mockDeserializedProduct.averageRating;
    const normalized = productNormalizer[0](
      mockDeserializedProduct,
      mockTransformer
    );
    expect(normalized).toEqual(
      expect.objectContaining({
        averageRating: 0,
      })
    );
  });
});
