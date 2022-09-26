import { Serializer } from '@spryker-oryx/core';
import { ApiCheckoutModel } from '../../../../models';
import {
  GetCheckoutDataProps,
  UpdateCheckoutDataProps,
} from '../../checkout.adapter';

export const CheckoutSerializers = 'FES.CheckoutSerializers';

export function checkoutAttributesSerializer(
  data: UpdateCheckoutDataProps | GetCheckoutDataProps
): Partial<ApiCheckoutModel.Payload> {
  return {
    attributes: {
      idCart: data.idCart,
      ...(data as UpdateCheckoutDataProps).attributes,
    },
    type: 'checkout-data',
  };
}

export const checkoutSerializers = [checkoutAttributesSerializer];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutSerializers]: Serializer<
      UpdateCheckoutDataProps | GetCheckoutDataProps
    >[];
  }
}
