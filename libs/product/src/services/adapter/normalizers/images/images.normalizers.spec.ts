import { ApiProductModel } from '../../../../models';
import { imagesNormalizer } from './images.normalizers';

const mockGlueImageSets: ApiProductModel.ImageSets = {
  imageSets: [
    {
      name: 'name',
      images: [
        {
          externalUrlLarge: 'externalUrlLarge',
          externalUrlSmall: 'externalUrlSmall',
        },
        {
          externalUrlLarge: 'externalUrlLarge1',
          externalUrlSmall: 'externalUrlSmall1',
        },
      ],
    },
    {
      name: 'name',
      images: [
        {
          externalUrlLarge: 'externalUrlLarge3',
          externalUrlSmall: 'externalUrlSmall3',
        },
        {
          externalUrlLarge: 'externalUrlLarge14',
          externalUrlSmall: 'externalUrlSmall14',
        },
      ],
    },
  ],
};
describe('Images Normalizer', () => {
  it('should transform ApiProductModel.ImageSets into ProductImage[]', () => {
    const mockResult = [
      ...mockGlueImageSets.imageSets[0].images,
      ...mockGlueImageSets.imageSets[1].images,
    ];
    const normalized = imagesNormalizer(mockGlueImageSets);
    expect(normalized).toEqual(mockResult);
  });
});
