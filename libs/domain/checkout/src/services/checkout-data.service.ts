import { Observable } from 'rxjs';
import { Checkout, CheckoutData } from '../models';

export interface CheckoutDataService<S = CheckoutData, T = Checkout> {
  /**
   * Indicates that the checkout is ready to start collecting data.
   * A checkout that is not ready is most likely not having an associated cart.
   */
  isReady(): Observable<boolean>;

  /**
   * Resolves the checkout data from the backend to provide checkout options to the user,
   * such as shipment and payment methods.
   */
  get<K extends keyof S>(key: K): Observable<S[K] | undefined>;

  /**
   * Sets the target checkout data.
   */
  set<K extends keyof T>(key: K, isValid: boolean, data?: T[K] | null): void;

  /**
   * Resolves the selected data for the given key from the collected data.
   *
   * When there's no selected item found, an empty (invalid) item is created (AKA registered...).
   */
  selected<K extends keyof T>(key: K): Observable<T[K] | null>;

  collect(): Observable<Partial<Checkout> | null>;

  /**
   * Clears the checkout data from memory to ensure that data is not leaked.
   * The cart is also reloaded, which means that in a multi-cart backen, the next
   * cart is loaded.
   */
  clear(): void;
}

export const CheckoutDataService = 'oryx.CheckoutDataService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutDataService]: CheckoutDataService;
  }
}
