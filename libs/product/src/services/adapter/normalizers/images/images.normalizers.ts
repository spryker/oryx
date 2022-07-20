import { ApiProductModel, ProductImage } from '../../../../models';

export const ImagesNormalizers = 'FES.ImagesNormalizers';

export function imagesNormalizer(
  data: ApiProductModel.ImageSets
): ProductImage[] {
  return data?.imageSets?.reduce?.(
    (acc, imageSet) => [...acc, ...imageSet.images],
    [] as ApiProductModel.Image[]
  );
}

export const imagesNormalizers = [imagesNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [ImagesNormalizers]: Transformer;
  }
}
