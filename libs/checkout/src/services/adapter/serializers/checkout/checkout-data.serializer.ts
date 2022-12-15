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

export const CheckoutDataSerializer = 'FES.CheckoutDataSerializers*';

export function checkoutDataAttributesSerializer(
  data: UpdateCheckoutDataProps | GetCheckoutDataProps
): Partial<ApiCheckoutModel.CheckoutDataPayload> {
  const { cartId, attributes: { carriers, ...attributesData } = {} } =
    data as UpdateCheckoutDataProps;
  let { attributes: { shipments } = {} } = data as UpdateCheckoutDataProps;
  const shipmentMethods =
    carriers?.reduce(
      (acc: ShipmentMethod[], carrier: Carrier) => [
        ...acc,
        ...carrier.shipmentMethods,
      ],
      []
    ) ?? [];

  shipments = shipments?.map((shipment) => {
    return {
      ...shipment,
      selectedShipmentMethod:
        shipment.selectedShipmentMethod ?? defaultSelectedShipmentMethod,
    };
  });

  return {
    attributes: {
      idCart: cartId,
      ...attributesData,
      shipments,
      shipmentMethods,
    },
    type: 'checkout-data',
  };
}

export const checkoutDataSerializer: Provider[] = [
  {
    provide: CheckoutDataSerializer,
    useValue: checkoutDataAttributesSerializer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutDataSerializer]: Serializer<
      UpdateCheckoutDataProps | GetCheckoutDataProps
    >[];
  }
}
