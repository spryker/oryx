import { Transformer } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { ApiCheckoutModel, Shipment, ShipmentMethod } from '../../../../models';
import { DeserializedCheckout } from '../checkout/model';

export const ShipmentsNormalizer = 'oryx.ShipmentsNormalizer*';

export function shipmentsNormalizer(data: DeserializedCheckout): Shipment[] {
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

declare global {
  interface InjectionTokensContractMap {
    [ShipmentsNormalizer]: Transformer<Shipment[]>[];
  }
}
