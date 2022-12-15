import { Serializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { ApiCheckoutModel } from '../../../../models';
import { PostCheckoutProps } from '../../checkout.adapter';

export const CheckoutSerializer = 'FES.CheckoutSerializers*';

export function checkoutAttributesSerializer(
  data: PostCheckoutProps
): Partial<ApiCheckoutModel.CheckoutPayload> {
  const { cartId, payments, ...attributeData } = data.attributes;

  const serializedPayments = payments?.map((payment) => {
    const { name, provider, ...paymentData } = payment;
    return {
      ...paymentData,
      paymentMethodName: name,
      paymentProviderName: provider,
    };
  });

  return {
    ...data,
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
    [CheckoutSerializer]: Serializer<PostCheckoutProps>[];
  }
}
