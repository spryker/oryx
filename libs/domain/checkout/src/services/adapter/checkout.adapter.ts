import { Observable } from 'rxjs';
import {
  ApiCheckoutModel,
  CheckoutData,
  CheckoutResponse,
  PlaceOrderData,
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

declare global {
  interface InjectionTokensContractMap {
    [CheckoutAdapter]: CheckoutAdapter;
  }
}
