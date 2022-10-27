import { Observable } from 'rxjs';
import { Currency } from '../../models';

export interface CurrencyService {
  getAll(): Observable<Currency[]>;
  get(): Observable<string>;
  set(value: string): void;
}

export const CurrencyService = 'FES.CurrencyService';

declare global {
  interface InjectionTokensContractMap {
    [CurrencyService]: CurrencyService;
  }
}
