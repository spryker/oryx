import { Observable } from 'rxjs';
import { Checkout, CheckoutData } from '../models';

export interface CheckoutDataService {
  /**
   * Resolves the checkout data from the backend to provide checkout options to the user,
   * such as shipment and payment methods.
   */
  get<K extends keyof CheckoutData>(
    key: K
  ): Observable<CheckoutData[K] | undefined>;
}

export const CheckoutDataService = 'oryx.CheckoutDataService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutDataService]: CheckoutDataService;
  }
}
