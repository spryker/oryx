import { CamelCase } from '@spryker-oryx/core/utilities';
import {
  ApiProductModel,
  DeserializedProductIncludes,
} from '@spryker-oryx/product';

export type DeserializedProductList = ApiProductModel.Attributes &
  Pick<
    DeserializedProductIncludes,
    CamelCase<ApiProductModel.Includes.AbstractProducts>
  >;
