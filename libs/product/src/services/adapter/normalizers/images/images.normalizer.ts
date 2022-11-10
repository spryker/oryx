import { Transformer } from '@spryker-oryx/core';
import { ApiProductModel, ProductMedia, Size } from '../../../../models';

export const ImagesNormalizer = 'FES.ImagesNormalizer*';

export function imagesNormalizer(
  data?: ApiProductModel.ImageSets
): ProductMedia[] {
  return (
    data?.imageSets?.reduce?.(
      (acc, imageSet) => [
        ...acc,
        ...imageSet.images.map((image) => {
          const sources: ProductMedia = {};
          const { externalUrlSmall, externalUrlLarge } = image;

          if (externalUrlSmall) {
            sources[Size.Sm] = externalUrlSmall;
          }

          if (externalUrlLarge !== externalUrlSmall) {
            sources[Size.Lg] = externalUrlLarge;
          }

          return sources;
        }),
      ],
      [] as ProductMedia[]
    ) ?? []
  );
}

declare global {
  interface InjectionTokensContractMap {
    [ImagesNormalizer]: Transformer<ProductMedia[]>[];
  }
}
