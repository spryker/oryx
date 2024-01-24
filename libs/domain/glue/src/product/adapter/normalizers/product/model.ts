import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiProductModel } from '../../../models/product.api.model';
import { DeserializedProductIncludes } from '../model';

export type DeserializedProduct = ApiProductModel.Concrete &
  Pick<
    DeserializedProductIncludes,
    | CamelCase<ApiProductModel.Includes.ConcreteProductImageSets>
    | CamelCase<ApiProductModel.Includes.ConcreteProductPrices>
    | CamelCase<ApiProductModel.Includes.Labels>
    | CamelCase<ApiProductModel.Includes.ConcreteProductAvailabilities>
    | CamelCase<ApiProductModel.Includes.AbstractProducts>
  >;
