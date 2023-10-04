import { camelize } from '@spryker-oryx/core/utilities';
import { of, take } from 'rxjs';
import { ApiProductModel, Product } from '../../../../models';
import { CategoryNormalizer } from '../../../category';
import { CategoryIdNormalizer } from '../category-id';
import { ProductMediaSetNormalizer } from '../media';
import { PriceNormalizer } from '../price';
import { DeserializedProduct } from './model';
import {
  productAttributeNormalizer,
  productCategoryNormalizer,
  productMediaSetNormalizer,
  productNodeNormalizer,
  productPriceNormalizer,
} from './product.normalizer';

let mockDeserializedProduct: DeserializedProduct;
const mockTokensData = {
  [PriceNormalizer]: {
    defaultPrice: {
      value: 300,
      isNet: true,
      currency: 'EUR',
    },
  },
  [ProductMediaSetNormalizer]: [
    {
      externalUrlLarge: 'externalUrlLarge',
      externalUrlSmall: 'externalUrlSmall',
    },
  ],
  [CategoryIdNormalizer]: '20',
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
      [camelize(ApiProductModel.Includes.AbstractProducts)]: [
        {
          [camelize(ApiProductModel.Includes.CategoryNodes)]: [
            {
              nodeId: 8,
              isActive: false,
            },
            {
              nodeId: 10,
              isActive: true,
            },
          ],
        },
      ],
    } as unknown as DeserializedProduct;
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
            price: mockTokensData[PriceNormalizer],
          });
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedProduct.concreteProductPrices?.[0],
            PriceNormalizer
          );
        });
    });
  });

  describe('Product Images Normalizers', () => {
    it('should call image transformer', () =>
      new Promise<void>((done) => {
        productMediaSetNormalizer(mockDeserializedProduct, mockTransformer)
          .pipe(take(1))
          .subscribe((normalized) => {
            expect(normalized).toEqual({
              mediaSet: mockTokensData[ProductMediaSetNormalizer],
            });
            expect(mockTransformer.transform).toHaveBeenCalledWith(
              mockDeserializedProduct.concreteProductImageSets?.[0].imageSets,
              ProductMediaSetNormalizer
            );
            done();
          });
      }));
  });

  describe('Product Node Normalizer', () => {
    it('should call node transformer', () =>
      new Promise<void>((done) => {
        productNodeNormalizer(mockDeserializedProduct, mockTransformer)
          .pipe(take(1))
          .subscribe((normalized) => {
            expect(normalized).toBe(mockTokensData[CategoryIdNormalizer]);
            expect(mockTransformer.transform).toHaveBeenCalledWith(
              mockDeserializedProduct.abstractProducts?.[0].categoryNodes,
              CategoryIdNormalizer
            );
            done();
          });
      }));
  });

  describe('Product Category Normalizer', () => {
    it('should call categories transformer', () =>
      new Promise<void>((done) => {
        productCategoryNormalizer(mockDeserializedProduct, mockTransformer)
          .pipe(take(1))
          .subscribe(() => {
            expect(mockTransformer.transform).toHaveBeenCalledWith(
              mockDeserializedProduct.abstractProducts?.[0].categoryNodes,
              CategoryNormalizer
            );
            done();
          });
      }));
  });
});
