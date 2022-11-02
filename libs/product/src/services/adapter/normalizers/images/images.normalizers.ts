import { Transformer } from '@spryker-oryx/core';
import { ApiProductModel, ProductMedia, Size } from '../../../../models';

export const ImagesNormalizers = 'FES.ImagesNormalizers';

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

          // we'll keep this till we start using the media component on PDP
          sources.externalUrlLarge = externalUrlLarge;
          sources.externalUrlSmall = externalUrlSmall;

          return sources;
        }),
      ],
      [] as ProductMedia[]
    ) ?? []
  );
}

export const imagesNormalizers = [imagesNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [ImagesNormalizers]: Transformer<ProductMedia[]>[];
  }
}
