import { Serializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { ApiCheckoutModel } from '../../../../models';
import {
  GetCheckoutDataProps,
  UpdateCheckoutDataProps,
} from '../../checkout.adapter';

export const CheckoutSerializer = 'FES.CheckoutSerializers*';

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

export const checkoutSerializer: Provider[] = [
  {
    provide: CheckoutSerializer,
    useValue: checkoutAttributesSerializer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CheckoutSerializer]: Serializer<
      UpdateCheckoutDataProps | GetCheckoutDataProps
    >[];
  }
}
