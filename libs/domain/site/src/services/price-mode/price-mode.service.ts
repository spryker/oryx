import { Guard } from '@spryker-oryx/core';
import { Observable } from 'rxjs';

export const PriceModeService = 'oryx.PriceModeService';
export const PriceModeChangeGuard = 'oryx.PriceModeChangeGuard*';
export const PriceMode = 'oryx.PriceMode';

export interface PriceModeService {
  get(): Observable<string>;
  set(value: string): Observable<void>;
}

declare global {
  interface InjectionTokensContractMap {
    [PriceModeService]: PriceModeService;
  }

  interface InjectionTokensContractMap {
    [PriceModeChangeGuard]: Guard;
  }

  interface Environment {
    readonly PRICE_MODE?: string;
  }
}
