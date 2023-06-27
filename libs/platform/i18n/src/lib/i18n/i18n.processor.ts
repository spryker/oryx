import { I18nContext } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';
import { I18nString } from '../models';

export interface I18nProcessor {
  interpolate(
    token: string | readonly string[],
    context: Observable<I18nContext | undefined>
  ): Observable<I18nString>;
}

export const I18nProcessor = 'oryx.I18nProcessor' as const;

declare global {
  interface InjectionTokensContractMap {
    [I18nProcessor]: I18nProcessor;
  }
}
