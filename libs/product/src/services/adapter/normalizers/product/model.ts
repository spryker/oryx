import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiProductModel } from '../../../../models';
import { DeserializedProductIncludes } from '../model';

export type DeserializedProduct = ApiProductModel.Concrete &
  Pick<
    DeserializedProductIncludes,
    | CamelCase<ApiProductModel.Includes.ConcreteProductImageSets>
    | CamelCase<ApiProductModel.Includes.ConcreteProductPrices>
    | CamelCase<ApiProductModel.Includes.Labels>
  >;
