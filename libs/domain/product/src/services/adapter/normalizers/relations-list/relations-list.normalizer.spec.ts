import { DeserializedProductListIncludes } from '@spryker-oryx/product';
import { of } from 'rxjs';
import { ProductNormalizer } from '../product/product.normalizer';
import { listNormalizer } from './relations-list.normalizer';

describe('Product relations list Normalizer', () => {
  const mockDeserializedProducts: DeserializedProductListIncludes[] = [{}, {}];
  const mockTransformer = {
    transform: vi.fn(),
    do: vi.fn(),
  };

  describe('listNormalizer', () => {
    it('should call Product Normalizer for each DeserializedProduct', () => {
      const mockProductsResult = 'mockProductsResult';
      mockTransformer.transform.mockReturnValue(of(mockProductsResult));

      listNormalizer(mockDeserializedProducts, mockTransformer).subscribe(
        (result) => {
          expect(result).toEqual(
            mockDeserializedProducts.map(() => mockProductsResult)
          );
          mockDeserializedProducts.forEach((product) => {
            expect(mockTransformer.transform).toHaveBeenCalledWith(
              product,
              ProductNormalizer
            );
          });
        }
      );
    });
  });
});
