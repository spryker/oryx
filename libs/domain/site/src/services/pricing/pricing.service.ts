import { Observable } from 'rxjs';

export interface Price {
  value: number;
  currency: string;
}

export type PriceValue = Price | number | string | undefined;

export interface PricingService {
  /**
   * @params price: string | number | {price: number, currency: string}
   *
   * Format the price based on locale and currency.
   * Compares default currency and price currency when price object is provided.
   * By default uses locale and currency from services.
   *
   * @return formatted price as string
   */
  format(price?: PriceValue, currency?: string): Observable<string | null>;
}

export const PricingService = 'oryx.PricingService';

declare global {
  interface InjectionTokensContractMap {
    [PricingService]: PricingService;
  }
}
