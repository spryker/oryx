import { camelize } from '@spryker-oryx/core/utilities';
import { ApiCheckoutModel, Shipment, ShipmentMethod } from '../../../../models';
import { DeserializedCheckout } from '../checkout/model';

export const ShipmentsNormalizers = 'FES.ShipmentsNormalizers';

export function shipmentsNormalizer(data: DeserializedCheckout): Shipment[] {
  if (!data) {
    return [];
  }

  const shipmentsKey = camelize(ApiCheckoutModel.Includes.Shipments);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const shipments = data[shipmentsKey]!;

  return shipments.map((shipment) => {
    const methods: Record<string, ShipmentMethod[]> = {};

    if (typeof shipment === 'object' && shipment.shipmentMethods) {
      for (let i = 0; i < shipment.shipmentMethods.length; i++) {
        const method: ShipmentMethod = shipment.shipmentMethods[i];
        const carrier = method.carrierName;
        methods[carrier] = [...(methods[carrier] ?? []), method];
      }
    }

    return { ...shipment, shipmentMethods: methods };
  });
}

export const shipmentsNormalizers = [shipmentsNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [ShipmentsNormalizers]: Transformer;
  }
}
