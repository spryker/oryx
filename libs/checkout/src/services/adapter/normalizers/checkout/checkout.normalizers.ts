import { Transformer, TransformerService } from '@spryker-oryx/core';
import { map, Observable } from 'rxjs';
import { CheckoutData, Shipment } from '../../../../models';
import { ShipmentsNormalizers } from '../shipments';
import { DeserializedCheckout } from './model';

export const CheckoutNormalizers = 'FES.CheckoutNormalizers';

export function checkoutAttributesNormalizer(
  data: DeserializedCheckout
): Partial<CheckoutData> {
  const { addresses, paymentProviders, selectedShipmentMethods } = data;
  return { addresses, paymentProviders, selectedShipmentMethods };
}

export function checkoutShipmentsNormalizer(
  data: DeserializedCheckout,
  transformer: TransformerService
): Observable<Partial<CheckoutData>> {
  return transformer
    .transform<Shipment[]>(data, ShipmentsNormalizers)
    .pipe(map((shipments) => ({ shipments })));
}

export const checkoutNormalizers = [
  checkoutAttributesNormalizer,
  checkoutShipmentsNormalizer,
];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutNormalizers]: Transformer[];
  }
}
