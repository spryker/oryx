import { Observable } from 'rxjs';
import { CheckoutProcessState, CheckoutResponse } from '../models';

export interface CheckoutService<T = Record<string, unknown>> {
  /**
   * Each step (or small part) of the checkout can be registered separately.
   * The registered steps are _called_ when the order got placed, to validate
   * and collect the checkout data.
   */
  register<K extends keyof T>(
    id: K,
    callback: () => Observable<T[K]>,
    order?: number
  ): void;

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
