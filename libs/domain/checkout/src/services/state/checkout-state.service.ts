import { Observable } from 'rxjs';
import { PlaceOrderData } from '../../models';

export interface CheckoutStateService {
  set<K extends keyof PlaceOrderData>(
    key: K,
    item: {
      valid?: boolean;
      value?: Partial<PlaceOrderData[K]> | null;
    }
  ): void;

  get<K extends keyof PlaceOrderData>(
    key: K
  ): Observable<PlaceOrderData[K] | null>;

  /**
   * returns the collected checkout state when its' all valid. When parts of the
   * checkout state is invalid, a null is returned.
   *
   * Passing complete as false will return the collected checkout state even if parts are invalid.
   * It will also not trigger invalidation of the checkout state.
   */
  getAll(complete?: boolean): Observable<Partial<PlaceOrderData> | null>;

  /**
   * returns the validity of the checkout state.
   */
  isInvalid(): Observable<boolean>;

  /**
   * Clears the checkout data from memory to ensure that data is not leaked.
   * The cart is also reloaded, which means that in a multi-cart backend, the next
   * cart is loaded.
   */
  clear(): void;
}

export const CheckoutStateService = 'oryx.CheckoutStateService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutStateService]: CheckoutStateService;
  }
}
