import { Serializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ApiCheckoutModel, PlaceOrderData } from '../../../../models';
import { checkoutAttributesSerializer } from './checkout.serializer';

export const CheckoutDataSerializer = 'oryx.CheckoutDataSerializers*';

export function checkoutDataAttributesSerializer(
  data: PlaceOrderData
): Partial<ApiCheckoutModel.CheckoutDataPayload> {
  return {
    ...checkoutAttributesSerializer(data),
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
    [CheckoutDataSerializer]: Serializer<PlaceOrderData>[];
  }
}
