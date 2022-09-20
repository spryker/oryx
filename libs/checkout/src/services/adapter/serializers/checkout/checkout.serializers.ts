import { Transformer } from '@spryker-oryx/core';
import { UpdateCheckoutDataProps } from '../../';
import { ApiCheckoutModel } from '../../../../models';

export const CheckoutSerializers = 'FES.CheckoutSerializers';

export function checkoutAttributesSerializer(
  data: UpdateCheckoutDataProps
): Partial<ApiCheckoutModel.Payload> {
  return {
    data: {
      attributes: { idCart: data.idCart, ...data.attributes },
      type: 'checkout-data',
    },
  };
}

export const checkoutSerializers = [checkoutAttributesSerializer];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutSerializers]: Transformer[];
  }
}
