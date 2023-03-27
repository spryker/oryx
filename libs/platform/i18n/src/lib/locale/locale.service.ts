import { Observable } from 'rxjs';
import { Locale } from '../models';

export interface LocaleService {
  getAll(): Observable<Locale[]>;
  get(): Observable<string>;
  set(value: string): void;
  formatDate(
    stamp: string | number | Date,
    showTime?: boolean,
    showDate?: boolean
  ): Observable<string>;
}

export const LocaleService = 'oryx.LocaleService';

declare global {
  interface InjectionTokensContractMap {
    [LocaleService]: LocaleService;
  }
}
