import { inject } from '@spryker-oryx/injector';
import { GlobalizeService } from './globalize.service';
import { I18nData, I18nDataBundle, I18nLoader } from './i18n.loader';

export interface DefaultI18nLoaderConfig {
  load?(localeId: string): Promise<{ default: I18nData }>;
  skipCache?: boolean;
}

export const DefaultI18nLoaderConfig = 'FES.DefaultI18nLoaderConfig' as const;

export class DefaultI18nLoader implements I18nLoader {
  protected cache: Partial<Record<string, I18nDataBundle>> =
    Object.create(null);

  load: I18nLoader['load'];

  constructor(
    protected config = inject(DefaultI18nLoaderConfig, null),
    protected globalizeService = inject(GlobalizeService)
  ) {
    this.load = this.config?.skipCache
      ? this.loadWithoutCache
      : this.loadWithCache;
  }

  protected async loadWithCache(localeId: string): Promise<I18nDataBundle> {
    this.cache[localeId] =
      this.cache[localeId] ?? (await this.loadWithoutCache(localeId));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.cache[localeId]!;
  }

  protected async loadWithoutCache(localeId: string): Promise<I18nDataBundle> {
    const locales = await this.globalizeService.resolveLocales(localeId);

    const dataBundles = await Promise.all(
      locales.map(
        (locale) =>
          this.config
            ?.load?.(locale)
            .then((m) => [locale, m.default] as const)
            // Explicitly mark that locale is missing if failed to load
            .catch(() => [locale, {}]) ?? [locale, {}]
      )
    );

    return Object.fromEntries(dataBundles);
  }
}

declare global {
  interface InjectionTokensContractMap {
    [DefaultI18nLoaderConfig]: DefaultI18nLoaderConfig;
  }
}
