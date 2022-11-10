import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { CheckoutData } from '../../../../models';
import { ShipmentsNormalizer } from '../shipments';
import { DeserializedCheckout } from './model';

export const CheckoutNormalizer = 'FES.CheckoutNormalizer*';

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
    .transform(data, ShipmentsNormalizer)
    .pipe(map((shipments) => ({ shipments })));
}

export const checkoutNormalizer: Provider[] = [
  {
    provide: CheckoutNormalizer,
    useValue: checkoutAttributesNormalizer,
  },
  {
    provide: CheckoutNormalizer,
    useValue: checkoutShipmentsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutNormalizer]: Transformer<CheckoutData>[];
  }
}
