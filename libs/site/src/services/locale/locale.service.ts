import { Observable } from 'rxjs';
import { Locale } from '../../models';

export interface LocaleService {
  getAll(): Observable<Locale[]>;
  get(): Observable<string>;
  set(value: string): void;
}

export const LocaleService = 'FES.LocaleService';

declare global {
  interface InjectionTokensContractMap {
    [LocaleService]: LocaleService;
  }
}
