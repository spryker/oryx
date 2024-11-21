import { ProductMedia } from '@spryker-oryx/product';
import { mediaNormalizer } from './media.normalizer';

const image = {
  externalUrlSmall: 'set1/small-1.jpg',
  externalUrlLarge: 'set1/large-1.jpg',
};

const duplicate = 'set3/image-1.jpg';

const image2 = {
  externalUrlSmall: duplicate,
  externalUrlLarge: duplicate,
};

describe('productMediaNormalizer', () => {
  let normalized: ProductMedia;

  describe('when the source contains a small and large image', () => {
    beforeEach(() => {
      normalized = mediaNormalizer(image);
    });

    it('should fill the sm and lg fields', () => {
      expect(normalized.sm).toBe('set1/small-1.jpg');
      expect(normalized.lg).toBe('set1/large-1.jpg');
    });

    it('should not fill xs, md and xl', () => {
      expect(normalized.xs).toBeUndefined();
      expect(normalized.md).toBeUndefined();
      expect(normalized.xl).toBeUndefined();
    });
  });

  describe('when the large image url is identical with the small', () => {
    beforeEach(() => {
      normalized = mediaNormalizer(image2);
    });

    it('should not expose the large url', () => {
      expect(normalized.sm).toBe(duplicate);
      expect(normalized.lg).toBeUndefined();
    });
  });
});
