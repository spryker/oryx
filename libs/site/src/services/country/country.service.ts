import { Observable } from 'rxjs';
import { Country } from '../../models';

export const CountryService = 'FES.CountryService';

export interface CountryService {
  get(): Observable<Country[]>;
}

declare global {
  interface InjectionTokensContractMap {
    [CountryService]: CountryService;
  }
}
