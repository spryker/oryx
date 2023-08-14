import { Observable } from 'rxjs';

export interface PriceModeService {
  get(): Observable<string>;
  set(value: string): void;
}

export const PriceModeService = 'oryx.PriceModeService';

declare global {
  interface InjectionTokensContractMap {
    [PriceModeService]: PriceModeService;
  }
}
