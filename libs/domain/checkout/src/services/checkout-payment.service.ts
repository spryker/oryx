import { Observable } from 'rxjs';
import { PaymentMethod } from '../models';

export interface CheckoutPaymentService {
  getMethods(): Observable<PaymentMethod[] | null>;
  setPaymentMethod(id: string): Observable<unknown>;
}

export const CheckoutPaymentService = 'FES.CheckoutPaymentService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutPaymentService]: CheckoutPaymentService;
  }
}
