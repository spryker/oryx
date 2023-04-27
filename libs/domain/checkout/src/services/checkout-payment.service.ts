import { Observable } from 'rxjs';
import { PaymentMethod } from '../models';

export interface CheckoutPaymentService {
  getMethods(): Observable<PaymentMethod[] | null>;
  setPaymentMethod(id: string): Observable<unknown>;
  getSelected(): Observable<string | undefined>;
}

export const CheckoutPaymentService = 'oryx.CheckoutPaymentService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutPaymentService]: CheckoutPaymentService;
  }
}
