import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiCartModel, CartId } from '../../../../models';
import { DeserializedCartIncludes } from '../model';

export type DeserializedCart = ApiCartModel.Attributes &
  Pick<
    DeserializedCartIncludes,
    CamelCase<ApiCartModel.Includes.GuestCartItems>
  > &
  CartId;
