import { Observable } from 'rxjs';
import { Checkout, CheckoutData } from '../models';

export interface CheckoutDataService<S = CheckoutData, T = Checkout> {
  get<K extends keyof S>(field: K): Observable<S[K] | undefined>;

  select<K extends keyof T>(key: K, data: T[K] | null, isValid: boolean): void;

  selected<K extends keyof T>(key: K): Observable<T[K] | null>;
}

export const CheckoutDataService = 'oryx.CheckoutDataService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutDataService]: CheckoutDataService;
  }
}
