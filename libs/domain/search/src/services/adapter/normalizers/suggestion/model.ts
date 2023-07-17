import { CamelCase } from '@spryker-oryx/core/utilities';
import {
  ApiProductModel,
  DeserializedProductIncludes,
} from '@spryker-oryx/product';
import { ApiSuggestionModel } from '../../../../models';

export type DeserializedSuggestion = ApiSuggestionModel.Attributes &
  Pick<
    DeserializedProductIncludes,
    | CamelCase<ApiProductModel.Includes.AbstractProducts>
    | CamelCase<ApiProductModel.Includes.CategoryNodes>
  >;
