import { ProductMediaSet } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { mediaSetNormalizer } from './media-set.normalizer';
import { ProductMediaNormalizer } from './media.normalizer';

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

const imageSet = [set1, set2];

const mockTransformedValue = 'mockTransformedValue';

const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(mockTransformedValue)),
  do: vi.fn(),
};

describe('productMediaNormalizer', () => {
  let normalized: Observable<ProductMediaSet[]>;

  beforeEach(() => {
    normalized = mediaSetNormalizer(imageSet, mockTransformer);
  });

  it('should call `ProductMediaNormalizer` transformer for image', () => {
    imageSet.forEach((set) => {
      set.images.forEach((image) => {
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          image,
          ProductMediaNormalizer
        );
      });
    });
  });

  it('should return observable', () => {
    expect(normalized).toBeInstanceOf(Observable);
  });

  it('should return `ProductMediaSet[]` where media should be result of transformation', () => {
    const expected = [
      { media: ['mockTransformedValue'], name: 'name' },
      {
        media: ['mockTransformedValue', 'mockTransformedValue'],
        name: 'name',
      },
    ];
    const callback = vi.fn();
    normalized.subscribe(callback);
    expect(callback).toHaveBeenCalledWith(expected);
  });
});
