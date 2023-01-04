import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { CheckoutResponse } from '../../../../models/checkout.model';

export const CheckoutResponseNormalizer = 'FES.CheckoutResponseNormalizer*';

export function checkoutResponseAttributesNormalizer(
  data: CheckoutResponse
): Partial<CheckoutResponse> {
  return data ?? {};
}

export const checkoutResponseNormalizer: Provider[] = [
  {
    provide: CheckoutResponseNormalizer,
    useValue: checkoutResponseAttributesNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutResponseNormalizer]: Transformer<CheckoutResponse>;
  }
}
