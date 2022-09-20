import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiCheckoutModel } from '../../../models';

export type DeserializedCheckoutIncludes = {
  [P in ApiCheckoutModel.Includes as `${CamelCase<P>}`]?: P extends ApiCheckoutModel.Includes.ShipmentMethods
    ? ApiCheckoutModel.ShipmentMethod[]
    : P extends ApiCheckoutModel.Includes.Shipments
    ? (ApiCheckoutModel.Shipment &
        Pick<
          DeserializedCheckoutIncludes,
          CamelCase<ApiCheckoutModel.Includes.ShipmentMethods>
        >)[]
    : never;
};
