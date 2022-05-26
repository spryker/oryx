import { Observable } from 'rxjs';

export interface LocaleService {
  getAll(): Observable<string[]>;
  get(): Observable<string>;
  set(value: string): void;
}

export const LocaleService = 'FES.LocaleService';

declare global {
  interface InjectionTokensContractMap {
    [LocaleService]: LocaleService;
  }
}
