import { ApiCartModel, CartId } from '@spryker-oryx/cart';
import { CamelCase } from '@spryker-oryx/core/utilities';

export type DeserializedCartIncludes = {
  [P in ApiCartModel.Includes as `${CamelCase<P>}`]?: P extends
    | ApiCartModel.Includes.Items
    | ApiCartModel.Includes.GuestCartItems
    ? ApiCartModel.Entry[]
    : never;
};

export type DeserializedCart = ApiCartModel.Attributes &
  Pick<
    DeserializedCartIncludes,
    CamelCase<
      ApiCartModel.Includes.Items | ApiCartModel.Includes.GuestCartItems
    >
  > &
  CartId;
