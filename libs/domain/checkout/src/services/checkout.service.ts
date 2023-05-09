import { Observable } from 'rxjs';
import { CheckoutResponse, CheckoutState } from '../models';

export interface CheckoutService {
  /**
   * Exposes the state of the checkout process so that the process can be
   * controlled in a consistent manner.
   */
  getState(): Observable<CheckoutState>;

  /**
   * Reads the checkout data from the checkoutDataService and, when valid,
   * places the order. The response data contains the redirect URL that shoudl
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
