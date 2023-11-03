import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { OnDestroy, inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';

import { Subscription, tap } from 'rxjs';

export const LocaleMetaInitializer = `${AppInitializer}LocaleMeta`;

export class DefaultLocaleMetaInitializer implements AppInitializer, OnDestroy {
  constructor(
    protected localeService = inject(LocaleService, null),
    protected metaService = inject(PageMetaService, null)
  ) {}

  // FF doesn't support textInfo
  protected rtlLanguages = [
    'ar', // Arabic
    'dv', // Dhivehi
    'he', // Hebrew
    'ks', // Kashmiri
    'ku', // Kurdish
    'fa', // Persian (Farsi)
    'ps', // Pashto
    'sd', // Sindhi
    'ug', // Uyghur
    'ur', // Urdu
    'yi', // Yiddish
  ];
  protected subscription = new Subscription();

  initialize(): void {
    if (!this.localeService?.get() || !this.metaService) return;

    this.subscription.add(
      this.localeService
        .get()
        .pipe(
          tap((lang: string) => {
            const dir = this.getTextDirection(lang);
            this.metaService?.setHtmlAttributes({ lang, dir });
          })
        )
        .subscribe()
    );
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * This method is used to get the text direction of the provided locale code.
   *
   * It uses the Intl.Locale API to get the text direction. If the Intl.Locale API
   * is not supported, it uses the rtlLanguages array to check if the locale code is RTL.
   */
  protected getTextDirection(localeCode: string): string {
    try {
      const locale = new Intl.Locale(localeCode);
      return (locale as any).textInfo.direction;
    } catch (error) {
      // Handle the error if the provided locale code is invalid or unsupported.
      // (FF doesn't support textInfo)
      return this.rtlLanguages.includes(localeCode) ? 'rtl' : 'ltr';
    }
  }

  /**
   * @deprecated use getTextDirection() instead
   */
  protected direction(localeCode: string): string {
    return this.getTextDirection(localeCode);
  }
}
