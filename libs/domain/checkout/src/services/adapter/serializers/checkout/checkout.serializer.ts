import { Serializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ApiCheckoutModel, PlaceOrderData } from '../../../../models';

export const CheckoutSerializer = 'oryx.CheckoutSerializers*';

export function checkoutAttributesSerializer(
  data: PlaceOrderData
): Partial<ApiCheckoutModel.CheckoutPayload> {
  const { cartId, payments, ...attributeData } = data;

  const serializedPayments = payments?.map((payment) => {
    const { name, provider, ...paymentData } = payment;
    return {
      ...paymentData,
      paymentMethodName: name,
      paymentProviderName: provider,
    };
  });

  return {
    type: 'checkout',
    attributes: {
      ...attributeData,
      idCart: cartId,
      payments: serializedPayments,
    },
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
    [CheckoutSerializer]: Serializer<PlaceOrderData>[];
  }
}
