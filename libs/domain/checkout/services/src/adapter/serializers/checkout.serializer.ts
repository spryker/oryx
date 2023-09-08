import { ApiCheckoutModel, PlaceOrderData } from '@spryker-oryx/checkout';

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
