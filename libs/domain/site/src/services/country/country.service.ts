import { Observable } from 'rxjs';
import { Country } from '../../models';

export const CountryService = 'oryx.CountryService';

export interface CountryService {
  getAll(): Observable<Country[]>;
  get(): Observable<Country | null>;
  set(value: string): void;
}

declare global {
  interface InjectionTokensContractMap {
    [CountryService]: CountryService;
  }
}
