import { Observable } from 'rxjs';

export interface PriceModeService {
  get(): Observable<string>;
  set(value: string): void;
  sendNotificationError(): void;
}

export const PriceModeService = 'oryx.PriceModeService';

export const PriceModeChangeGuard = 'oryx.PriceModeChangeGuard*';

export const PriceMode = 'oryx.PriceMode';

declare global {
  interface InjectionTokensContractMap {
    [PriceModeService]: PriceModeService;
  }

  interface Environment {
    readonly PRICE_MODE?: string;
  }
}
