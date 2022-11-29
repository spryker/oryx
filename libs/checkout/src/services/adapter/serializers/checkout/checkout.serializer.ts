import { Serializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import {
  ApiCheckoutModel,
  Carrier,
  defaultSelectedShipmentMethod,
  ShipmentMethod,
} from '../../../../models';
import {
  GetCheckoutDataProps,
  UpdateCheckoutDataProps,
} from '../../checkout.adapter';

export const CheckoutSerializer = 'FES.CheckoutSerializers*';

export function checkoutAttributesSerializer(
  data: UpdateCheckoutDataProps | GetCheckoutDataProps
): Partial<ApiCheckoutModel.Payload> {
  const attributes = { ...(data as UpdateCheckoutDataProps).attributes };
  const shipmentMethods =
    attributes?.carriers?.reduce(
      (acc: ShipmentMethod[], carrier: Carrier) => [
        ...acc,
        ...carrier.shipmentMethods,
      ],
      []
    ) ?? [];

  delete attributes.carriers;
  const shipments = attributes?.shipments?.map((shipment) => {
    return {
      ...shipment,
      selectedShipmentMethod:
        shipment.selectedShipmentMethod ?? defaultSelectedShipmentMethod,
    };
  });

  return {
    attributes: {
      idCart: data.cartId,
      ...attributes,
      shipments,
      shipmentMethods,
    },
    type: 'checkout-data',
  };
}

export const checkoutSerializer: Provider[] = [
  {
    provide: CheckoutSerializer,
    useValue: checkoutAttributesSerializer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutSerializer]: Serializer<
      UpdateCheckoutDataProps | GetCheckoutDataProps
    >[];
  }
}
