import { ApiModel } from '../../../../models';

export const ImagesNormalizer = 'FES.ImagesNormalizer';

export interface GlueImageSets {
  imageSets: {
    name: string;
    images: ApiModel.ProductImage[];
  }[];
}
declare global {
  interface InjectionTokensContractMap {
    [ImagesNormalizer]: Transformer;
  }
}
