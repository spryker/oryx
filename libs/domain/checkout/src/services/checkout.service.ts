import { Observable } from 'rxjs';
import { CheckoutProcessState, CheckoutResponse } from '../models';

export interface CheckoutService {
  /**
   * Exposes the state of the checkout process so that the process can be
   * controlled in a consistent manner.
   */
  getProcessState(): Observable<CheckoutProcessState>;

  /**
   * Validates the checkout data
   * Submits the order
   * Do post processing
   */
  placeOrder(): Observable<CheckoutResponse>;
}

export const CheckoutService = 'oryx.CheckoutService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutService]: CheckoutService;
  }
}
