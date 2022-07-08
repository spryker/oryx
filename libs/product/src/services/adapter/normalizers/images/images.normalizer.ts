import { ProductImage } from '../../../../models';
import { GlueImageSets } from './model';

export function imagesNormalizer(data: GlueImageSets): ProductImage[] {
  return data?.imageSets?.reduce?.(
    (acc, imageSet) => [...acc, ...imageSet.images],
    [] as ProductImage[]
  );
}
