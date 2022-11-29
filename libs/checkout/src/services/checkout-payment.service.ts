import { Observable } from 'rxjs';
import { PaymentMethod } from '../models';

export interface CheckoutPaymentService {
  getMethods(): Observable<PaymentMethod[] | null>;
}

export const CheckoutPaymentService = 'FES.CheckoutPaymentService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutPaymentService]: CheckoutPaymentService;
  }
}
