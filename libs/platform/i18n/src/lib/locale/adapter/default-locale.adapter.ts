import { inject } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { Locale } from '../../models';
import { LocaleAdapter } from './locale.adapter';

export class DefaultLocaleAdapter implements LocaleAdapter {
  constructor(
    protected readonly config = inject(DefaultLocaleAdapterConfig, null)
  ) {}

  getAll(): Observable<Locale[]> {
    return of(this.config?.locales ?? []);
  }

  getDefault(): Observable<string> {
    return of(
      this.config?.defaultLocale ??
        this.config?.locales?.[0].code ??
        this.getFallbackLang()
    );
  }

  protected getFallbackLang(): string {
    return navigator.language;
  }
}

export interface DefaultLocaleAdapterConfig {
  readonly locales?: Locale[];
  readonly defaultLocale?: string;
}

export const DefaultLocaleAdapterConfig = 'oryx.DefaultLocaleAdapterConfig';

declare global {
  interface InjectionTokensContractMap {
    [DefaultLocaleAdapterConfig]: DefaultLocaleAdapterConfig;
  }
}
