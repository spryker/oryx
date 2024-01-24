import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiProductModel } from '../../../models/product.api.model';
import { DeserializedProductIncludes } from '../model';

export type DeserializedAbstract = ApiProductModel.Abstract &
  Pick<
    DeserializedProductIncludes,
    | CamelCase<ApiProductModel.Includes.ConcreteProducts>
    | CamelCase<ApiProductModel.Includes.CategoryNodes>
  >;
