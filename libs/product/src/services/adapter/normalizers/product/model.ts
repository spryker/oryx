import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiProductModel } from '../../../../models';

export type DeserializedIncludes = {
  [P in ApiProductModel.Includes as `${CamelCase<P>}`]?: P extends ApiProductModel.Includes.ConcreteProductImageSets
    ? ApiProductModel.ImageSets[]
    : P extends ApiProductModel.Includes.ConcreteProductPrices
    ? ApiProductModel.Prices[]
    : never;
};

export type DeserializedProduct = ApiProductModel.Attributes &
  DeserializedIncludes;
