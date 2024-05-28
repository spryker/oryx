import { CheckoutResponse } from '@spryker-oryx/checkout';

export function checkoutResponseAttributesNormalizer(
  data: CheckoutResponse
): Partial<CheckoutResponse> {
  return data ?? {};
}
