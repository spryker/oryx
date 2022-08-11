import { Observable } from 'rxjs';

export interface CurrencyService {
  getAll(): Observable<string[]>;
  get(): Observable<string>;
  set(value: string): void;
}

export const CurrencyService = 'FES.CurrencyService';

declare global {
  interface InjectionTokensContractMap {
    [CurrencyService]: CurrencyService;
  }
}
