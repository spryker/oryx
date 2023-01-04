import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiCartModel, CartId } from '../../../../models';
import { DeserializedCartIncludes } from '../model';

export type DeserializedCart = ApiCartModel.Attributes &
  Pick<
    DeserializedCartIncludes,
    CamelCase<
      ApiCartModel.Includes.Items | ApiCartModel.Includes.GuestCartItems
    >
  > &
  CartId;
