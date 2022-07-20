import {
  ApiProductModel,
  DeserializedProductIncludes,
} from '@spryker-oryx/product';
import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiSuggestionModel } from '../../../../models';

export type DeserializedSuggestion = ApiSuggestionModel.Attributes &
  Pick<
    DeserializedProductIncludes,
    CamelCase<ApiProductModel.Includes.AbstractProducts>
  >;
