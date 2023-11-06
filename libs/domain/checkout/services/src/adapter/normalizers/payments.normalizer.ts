import { ApiCheckoutModel, PaymentMethod } from '@spryker-oryx/checkout';
import { camelize } from '@spryker-oryx/core/utilities';
import { DeserializedCheckout } from './model';

export function paymentsNormalizer(
  data?: DeserializedCheckout
): PaymentMethod[] {
  if (!data) {
    return [];
  }

  const paymentsKey = camelize(ApiCheckoutModel.Includes.PaymentMethods);
  return (
    data[paymentsKey]
      ?.map((payment) => {
        const { paymentMethodName, paymentProviderName, ...paymentData } =
          payment;
        return {
          ...paymentData,
          name: paymentMethodName,
          provider: paymentProviderName,
        };
      })
      .sort((a, b) =>
        a.provider.toLowerCase() < b.provider.toLowerCase()
          ? -1
          : a.provider.toLowerCase() > b.provider.toLowerCase()
          ? 1
          : 0
      ) ?? []
  );
}
