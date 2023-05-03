import { Observable } from 'rxjs';
import { PaymentMethod } from '../../models';

export interface CheckoutPaymentService {
  getMethods(): Observable<PaymentMethod[] | null>;
  select(id: string): Observable<unknown>;
  selected(): Observable<PaymentMethod | null>;
}

export const CheckoutPaymentService = 'oryx.CheckoutPaymentService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutPaymentService]: CheckoutPaymentService;
  }
}
