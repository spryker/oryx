import {
  ApiCheckoutModel,
  Shipment,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { camelize } from '@spryker-oryx/core/utilities';
import { DeserializedCheckout } from './model';

export function shipmentsNormalizer(data?: DeserializedCheckout): Shipment[] {
  if (!data) return [];

  const shipmentsKey = camelize(ApiCheckoutModel.Includes.Shipments);
  const shipments = data[shipmentsKey] ?? [];

  return shipments.map((shipment) => {
    const methods: Record<string, ShipmentMethod[]> = {};

    if (typeof shipment === 'object' && shipment.shipmentMethods) {
      for (let i = 0; i < shipment.shipmentMethods.length; i++) {
        const method: ShipmentMethod = shipment.shipmentMethods[i];
        const carrier = method.carrierName;
        methods[carrier] = [...(methods[carrier] ?? []), method];
      }
    }

    delete shipment.shipmentMethods;

    return {
      ...shipment,
      carriers: Object.keys(methods).map((carrier) => {
        return { name: carrier, shipmentMethods: methods[carrier] };
      }),
    };
  });
}
