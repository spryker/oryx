import { Observable } from 'rxjs';
import { ApiCheckoutModel, Checkout, CheckoutData } from '../../models';

export interface GetCheckoutDataProps {
  cartId: string;
  include?: ApiCheckoutModel.Includes[];
}

export interface UpdateCheckoutDataProps {
  cartId: string;
  include?: ApiCheckoutModel.Includes[];
  attributes: CheckoutData;
}

export interface PostCheckoutProps {
  attributes: Checkout;
}

export interface CheckoutAdapter {
  get: (data: GetCheckoutDataProps) => Observable<CheckoutData>;
  update: (data: UpdateCheckoutDataProps) => Observable<CheckoutData>;
  placeOrder: (data: PostCheckoutProps) => Observable<CheckoutData>;
}

export const CheckoutAdapter = 'FES.CheckoutAdapter';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutAdapter]: CheckoutAdapter;
  }
}
