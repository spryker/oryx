import { I18nContext, InferI18nContext } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';
import { I18nString } from '../models';

export interface I18nService {
  translate<
    T extends string | readonly string[],
    Ctx extends I18nContext = InferI18nContext<T>
  >(
    token: T,
    context?: Ctx | Observable<Ctx>
  ): Observable<I18nString>;
}

export const I18nService = 'oryx.I18nService' as const;

declare global {
  interface InjectionTokensContractMap {
    [I18nService]: I18nService;
  }
}
