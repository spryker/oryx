import { ConcreteProductsNormalizers } from '@spryker-oryx/product';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { productNormalizer } from './product-list.normalizers';

const mockDeserializedProductList = {
  abstractProducts: [],
};

const mockTransformer = {
  transform: vi.fn(),
  do: vi.fn(),
};

describe('Product Catalog Normalizers', () => {
  it('should call transformers and return result', () => {
    const mockProductsResult = 'mockProductsResult';
    mockTransformer.transform.mockReturnValue(of(mockProductsResult));
    productNormalizer([mockDeserializedProductList], mockTransformer)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toEqual({
          products: mockProductsResult,
        });
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockDeserializedProductList.abstractProducts,
          ConcreteProductsNormalizers
        );
      });
  });
});
