import { I18nContext, InferI18nContext } from '@spryker-oryx/utilities/i18n';
import { Observable } from 'rxjs';

export interface I18nService {
  translate<
    T extends string | readonly string[],
    Ctx extends I18nContext = InferI18nContext<T>
  >(
    token: T,
    context?: Ctx | Observable<Ctx>
  ): Observable<string>;
}

export const I18nService = 'FES.I18nService' as const;

declare global {
  interface InjectionTokensContractMap {
    [I18nService]: I18nService;
  }
}
