import { Observable } from 'rxjs';

export const PriceModeService = 'oryx.PriceModeService';
export const PriceMode = 'oryx.PriceMode';

export interface PriceModeService {
  get(): Observable<string>;
  set(value: string): void;
}

declare global {
  interface InjectionTokensContractMap {
    [PriceModeService]: PriceModeService;
  }
  interface Environment {
    readonly PRICE_MODE?: string;
  }
}
