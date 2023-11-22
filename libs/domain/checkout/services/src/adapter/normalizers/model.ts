import { ApiCheckoutModel } from '@spryker-oryx/checkout';
import { CamelCase } from '@spryker-oryx/core/utilities';

export type DeserializedCheckoutIncludes = {
  [P in ApiCheckoutModel.Includes as `${CamelCase<P>}`]?: P extends ApiCheckoutModel.Includes.ShipmentMethods
    ? ApiCheckoutModel.ShipmentMethod[]
    : P extends ApiCheckoutModel.Includes.PaymentMethods
    ? ApiCheckoutModel.PaymentMethod[]
    : P extends ApiCheckoutModel.Includes.Shipments
    ? (ApiCheckoutModel.Shipment &
        Pick<
          DeserializedCheckoutIncludes,
          CamelCase<ApiCheckoutModel.Includes.ShipmentMethods>
        >)[]
    : never;
};

export type DeserializedCheckout = ApiCheckoutModel.Attributes &
  Pick<
    DeserializedCheckoutIncludes,
    CamelCase<
      | ApiCheckoutModel.Includes.Shipments
      | ApiCheckoutModel.Includes.PaymentMethods
      | ApiCheckoutModel.Includes.Carts
      | ApiCheckoutModel.Includes.GuestCarts
    >
  >;
