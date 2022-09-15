import {
  ApiProductModel,
  DeserializedProductIncludes,
} from '@spryker-oryx/product';
import { CamelCase } from '@spryker-oryx/typescript-utils';

export type DeserializedProductList = ApiProductModel.Attributes &
  Pick<
    DeserializedProductIncludes,
    CamelCase<ApiProductModel.Includes.AbstractProducts>
  >;
