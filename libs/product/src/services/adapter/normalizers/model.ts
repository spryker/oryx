import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiProductModel } from '../../../models';

export type DeserializedProductIncludes = {
  [P in ApiProductModel.Includes as `${CamelCase<P>}`]?: P extends ApiProductModel.Includes.ConcreteProductImageSets
    ? ApiProductModel.ImageSets[]
    : P extends ApiProductModel.Includes.ConcreteProductPrices
    ? ApiProductModel.Prices[]
    : P extends ApiProductModel.Includes.AbstractProducts
    ? ApiProductModel.Abstract[]
    : P extends ApiProductModel.Includes.ConcreteProducts
    ? (ApiProductModel.Concrete &
        Pick<
          DeserializedProductIncludes,
          CamelCase<ApiProductModel.Includes.AbstractProducts>
        >)[]
    : never;
};
