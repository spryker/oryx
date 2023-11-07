import { Serializer, Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import {
  ApiCheckoutModel,
  CheckoutData,
  CheckoutResponse,
  PaymentMethod,
  PlaceOrderData,
  Shipment,
} from '../../models';

export interface GetCheckoutDataProps {
  cartId: string;
  include?: ApiCheckoutModel.Includes[];
}

export interface UpdateCheckoutDataProps {
  cartId: string;
  include?: ApiCheckoutModel.Includes[];
  attributes: CheckoutData;
}

export interface CheckoutAdapter {
  get: (data: PlaceOrderData) => Observable<CheckoutData>;
  placeOrder: (data: PlaceOrderData) => Observable<CheckoutResponse>;
}

export const CheckoutAdapter = 'oryx.CheckoutAdapter';

export const CheckoutNormalizer = 'oryx.CheckoutNormalizer*';
export const CheckoutResponseNormalizer = 'oryx.CheckoutResponseNormalizer*';
export const ShipmentsNormalizer = 'oryx.ShipmentsNormalizer*';
export const PaymentsNormalizer = 'oryx.PaymentsNormalizer*';

export const CheckoutSerializer = 'oryx.CheckoutSerializers*';
export const CheckoutDataSerializer = 'oryx.CheckoutDataSerializers*';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutAdapter]: CheckoutAdapter;
    [CheckoutNormalizer]: Transformer<CheckoutData>[];
    [CheckoutResponseNormalizer]: Transformer<CheckoutResponse>;
    [PaymentsNormalizer]: Transformer<PaymentMethod[]>[];
    [ShipmentsNormalizer]: Transformer<Shipment[]>[];

    [CheckoutSerializer]: Serializer<PlaceOrderData>[];
    [CheckoutDataSerializer]: Serializer<PlaceOrderData>[];
  }
}
