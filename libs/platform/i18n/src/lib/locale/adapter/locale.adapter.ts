import { Observable } from 'rxjs';
import { Locale } from '../../models';

export interface LocaleAdapter {
  getAll(): Observable<Locale[]>;
  getDefault(): Observable<string>;
}

export const LocaleAdapter = 'oryx.LocaleAdapter';

declare global {
  interface InjectionTokensContractMap {
    [LocaleAdapter]: LocaleAdapter;
  }
}
