import { CartsNormalizer } from '@spryker-oryx/cart';
import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { map, Observable } from 'rxjs';
import { CheckoutData } from '../../../../models';
import { PaymentsNormalizer } from '../payments';
import { ShipmentsNormalizer } from '../shipments';
import { DeserializedCheckout } from './model';

export const CheckoutNormalizer = 'oryx.CheckoutNormalizer*';

export function checkoutAttributesNormalizer(
  data: DeserializedCheckout
): Partial<CheckoutData> {
  const {
    addresses,
    paymentProviders,
    selectedShipmentMethods,
    selectedPaymentMethods,
    carts,
    guestCarts,
  } = data;
  return {
    addresses,
    paymentProviders,
    selectedShipmentMethods,
    selectedPaymentMethods,
    carts: carts ?? guestCarts,
  };
}

export function checkoutShipmentsNormalizer(
  data: DeserializedCheckout,
  transformer: TransformerService
): Observable<Partial<CheckoutData>> {
  return transformer
    .transform(data, ShipmentsNormalizer)
    .pipe(map((shipments) => ({ shipments })));
}

export function checkoutPaymentsNormalizer(
  data: DeserializedCheckout,
  transformer: TransformerService
): Observable<Partial<CheckoutData>> {
  return transformer
    .transform(data, PaymentsNormalizer)
    .pipe(map((paymentMethods) => ({ paymentMethods })));
}

export function checkoutCartsNormalizer(
  data: DeserializedCheckout,
  transformer: TransformerService
): Observable<Partial<CheckoutData>> {
  return transformer
    .transform(data, CartsNormalizer)
    .pipe(map((carts) => ({ carts })));
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
  {
    provide: CheckoutNormalizer,
    useValue: checkoutPaymentsNormalizer,
  },
  {
    provide: CheckoutNormalizer,
    useValue: checkoutCartsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutNormalizer]: Transformer<CheckoutData>[];
  }
}
