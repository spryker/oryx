import { ApiModel, ProductImage } from '@spryker-oryx/product';

export interface GlueImageSets {
  imageSets: {
    name: string;
    images: ApiModel.ProductImage[];
  }[];
}

export function convertProductImages(
  attributes: GlueImageSets
): ProductImage[] {
  return attributes.imageSets.reduce(
    (acc, imageSet) => [...acc, ...imageSet.images],
    [] as ProductImage[]
  );
}
