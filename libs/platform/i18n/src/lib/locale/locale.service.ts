import { Observable } from 'rxjs';
import { Locale } from '../models';

export interface LocaleService {
  getAll(): Observable<Locale[]>;
  get(): Observable<string>;
  set(value: string): void;
  formatDate(stamp: string | number | Date): Observable<string>;
  formatDay(day: string): Observable<string>;
  formatTime(stamp: string | number | Date): Observable<string>;
  formatDateTime(stamp: string | number | Date): Observable<string>;
}

export const LocaleService = 'oryx.LocaleService';

declare global {
  interface InjectionTokensContractMap {
    [LocaleService]: LocaleService;
  }
}
