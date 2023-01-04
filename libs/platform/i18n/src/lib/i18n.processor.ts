import { I18nContext } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';

export interface I18nProcessor {
  interpolate(
    token: string | readonly string[],
    context: Observable<I18nContext | undefined>
  ): Observable<string>;
}

export const I18nProcessor = 'FES.I18nProcessor' as const;

declare global {
  interface InjectionTokensContractMap {
    [I18nProcessor]: I18nProcessor;
  }
}
