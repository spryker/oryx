import { ConcreteProductsNormalizer } from '@spryker-oryx/product';
import { of, take } from 'rxjs';
import { DeserializedSuggestion } from './model';
import {
  suggestionAttributesNormalizer,
  suggestionProductNormalizer,
} from './suggestion.normalizer';

const mockDeserializedSuggestion = {
  completion: ['A'],
  categories: [
    {
      url: 'categories-url',
      name: 'name',
    },
  ],
  cmsPages: [
    {
      url: 'cmsPages-url',
      name: 'name',
    },
  ],
  abstractProducts: [
    {
      abstractProducts: 'abstractProducts',
    },
  ],
} as unknown as DeserializedSuggestion;
const mockTransformer = {
  transform: vi.fn(),
  do: vi.fn(),
};

describe('Suggestion Normalizers', () => {
  describe('Suggestion Attributes Normalizer', () => {
    it('should transform DeserializedSuggestion into Suggestion', () => {
      const mockResult = {
        completion: mockDeserializedSuggestion.completion,
        categories: mockDeserializedSuggestion.categories,
        cmsPages: mockDeserializedSuggestion.cmsPages,
      };
      const normalized = suggestionAttributesNormalizer([
        mockDeserializedSuggestion,
      ]);
      expect(normalized).toEqual(mockResult);
    });
  });

  describe('Suggestion Product Normalizer', () => {
    it('should call transformers and return result', () => {
      const mockProductsResult = 'mockProductsResult';
      mockTransformer.transform.mockReturnValue(of(mockProductsResult));
      suggestionProductNormalizer([mockDeserializedSuggestion], mockTransformer)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            products: mockProductsResult,
          });
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedSuggestion.abstractProducts,
            ConcreteProductsNormalizer
          );
        });
    });
  });
});
