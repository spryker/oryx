import { ApiProductModel, ProductImage } from '../../../../models';

export const ImagesNormalizer = 'FES.ImagesNormalizer';

export function imagesNormalizer(
  data: ApiProductModel.ImageSets
): ProductImage[] {
  return data?.imageSets?.reduce?.(
    (acc, imageSet) => [...acc, ...imageSet.images],
    [] as ApiProductModel.Image[]
  );
}

declare global {
  interface InjectionTokensContractMap {
    [ImagesNormalizer]: Transformer;
  }
}
