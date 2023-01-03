import { Observable } from 'rxjs';
import { CheckoutResponse } from '../models';

export interface CheckoutService {
  canCheckout(): Observable<boolean>;
  placeOrder(): Observable<CheckoutResponse>;
}

export const CheckoutService = 'oryx.CheckoutService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutService]: CheckoutService;
  }
}
