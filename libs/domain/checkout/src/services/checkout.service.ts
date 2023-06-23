import { Observable } from 'rxjs';
import { CheckoutResponse, CheckoutStatus } from '../models';

export interface CheckoutService {
  /**
   * Exposes the state of the checkout process so that the process can be
   * controlled in a consistent manner.
   */
  getStatus(): Observable<CheckoutStatus>;

  /**
   * Reads the checkout data from the checkoutStateService and, when valid,
   * places the order. The response data contains the redirect URL that should
   * be used to bring the user to the next page which is typically the payment
   * landing page or the order confirmation or failure page.
   */
  placeOrder(): Observable<CheckoutResponse>;
}

export const CheckoutService = 'oryx.CheckoutService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutService]: CheckoutService;
  }
}
