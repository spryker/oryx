import { camelize } from '@spryker-oryx/typescript-utils';
import { of, take } from 'rxjs';
import { ApiProductModel, Product } from '../../../../models';
import { ImagesNormalizers } from '../images';
import { PriceNormalizers } from '../price';
import { DeserializedProduct } from './model';
import {
  productAttributeNormalizer,
  productImagesNormalizer,
  productPriceNormalizer,
} from './product.normalizers';

let mockDeserializedProduct: DeserializedProduct;
const mockTokensData = {
  [PriceNormalizers]: {
    defaultPrice: {
      value: 300,
      isNet: true,
      currency: 'EUR',
    },
  },
  [ImagesNormalizers]: [
    {
      externalUrlLarge: 'externalUrlLarge',
      externalUrlSmall: 'externalUrlSmall',
    },
  ],
};
const mockTransformer = {
  transform: vi
    .fn()
    .mockImplementation((data, token: keyof typeof mockTokensData): unknown =>
      of(mockTokensData[token])
    ),
  do: vi.fn(),
};

describe('Product Normalizers', () => {
  beforeEach(() => {
    mockDeserializedProduct = {
      sku: 'sku',
      name: 'name',
      description: 'description',
      reviewCount: 3,
      averageRating: '5',
      [camelize(ApiProductModel.Includes.ConcreteProductImageSets)]: [
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
      [camelize(ApiProductModel.Includes.ConcreteProductPrices)]: [
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
      attributes: {
        color: 'red',
        brand: 'Brand1',
      },
      attributeNames: {
        color: 'Color',
        brand: 'Brand',
      },
    };
  });

  describe('Product Attributes Normalizer', () => {
    it('should transform DeserializedProduct into Product', () => {
      const mockResult: Product = {
        sku: mockDeserializedProduct.sku,
        name: mockDeserializedProduct.name,
        description: mockDeserializedProduct.description,
        averageRating: Number(mockDeserializedProduct.averageRating),
        reviewCount: mockDeserializedProduct.reviewCount,
        attributes: mockDeserializedProduct.attributes,
        attributeNames: mockDeserializedProduct.attributeNames,
      };
      const normalized = productAttributeNormalizer(mockDeserializedProduct);
      expect(normalized).toEqual(mockResult);
    });

    it('should return `averageRating` as 0 if its falsy', () => {
      delete mockDeserializedProduct.averageRating;
      const normalized = productAttributeNormalizer(mockDeserializedProduct);
      expect(normalized).toEqual(
        expect.objectContaining({
          averageRating: 0,
        })
      );
    });
  });

  describe('Product Price Normalizer', () => {
    it('should call price transformer', () => {
      productPriceNormalizer(mockDeserializedProduct, mockTransformer)
        .pipe(take(1))
        .subscribe((normalized) => {
          expect(normalized).toEqual({
            price: mockTokensData[PriceNormalizers],
          });
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedProduct.concreteProductPrices?.[0],
            PriceNormalizers
          );
        });
    });
  });

  describe('Product Images Normalizers', () => {
    it('should call image transformer', () => {
      productImagesNormalizer(mockDeserializedProduct, mockTransformer)
        .pipe(take(1))
        .subscribe((normalized) => {
          expect(normalized).toEqual({
            images: mockTokensData[ImagesNormalizers],
          });
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedProduct.concreteProductImageSets?.[0],
            ImagesNormalizers
          );
        });
    });
  });
});
