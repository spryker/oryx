import { ProductMedia } from '../../../../models';
import { imagesNormalizer } from './images.normalizer';

const set1 = {
  name: 'name',
  images: [
    {
      externalUrlSmall: 'set1/small-1.jpg',
      externalUrlLarge: 'set1/large-1.jpg',
    },
  ],
};

const set2 = {
  name: 'name',
  images: [
    {
      externalUrlSmall: 'set2/small-1.jpg',
      externalUrlLarge: 'set2/large-1.jpg',
    },
    {
      externalUrlSmall: 'set2/small-2.jpg',
      externalUrlLarge: 'set2/large-2.jpg',
    },
  ],
};

const duplicate = 'set3/image-1.jpg';
const set3 = {
  name: 'set with duplicates',
  images: [
    {
      externalUrlSmall: duplicate,
      externalUrlLarge: duplicate,
    },
  ],
};

describe('imagesNormalizer', () => {
  let normalized: ProductMedia[];

  describe('when the source contains a small and large image', () => {
    beforeEach(() => {
      normalized = imagesNormalizer({ imageSets: [set1] });
    });

    it('should fill the sm and lg fields', () => {
      expect(normalized[0].sm).toBe('set1/small-1.jpg');
      expect(normalized[0].lg).toBe('set1/large-1.jpg');
    });

    it('should not fill xs, md and xl', () => {
      expect(normalized[0].xs).toBeUndefined();
      expect(normalized[0].md).toBeUndefined();
      expect(normalized[0].xl).toBeUndefined();
    });
  });

  describe('when the source has multiple image sets', () => {
    beforeEach(() => {
      normalized = imagesNormalizer({ imageSets: [set1, set2] });
    });

    it('should normalise all images in a single array', () => {
      expect(normalized.length).toBe(3);
    });
  });

  describe('when the large image url is identical with the small', () => {
    beforeEach(() => {
      normalized = imagesNormalizer({ imageSets: [set3] });
    });

    it('should not expose the large url', () => {
      expect(normalized[0].sm).toBe(duplicate);
      expect(normalized[0].lg).toBeUndefined();
    });
  });
});
