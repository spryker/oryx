import { of, take } from 'rxjs';

import { ConcreteProductsNormalizer } from '@spryker-oryx/product';
import { concreteProductNormalizer } from './product-list.normalizer';

const mockDeserializedProductList = {
  abstractProducts: [],
};

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
});
