import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject, OnDestroy } from '@spryker-oryx/di';
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
    if (!this.localeService?.get() || !this.metaService) {
      return;
    }

    this.subscription.add(
      this.localeService
        .get()
        .pipe(
          tap((lang: string) => {
            this.metaService?.setHtmlAttributes({
              lang,
              dir: this.direction(lang),
            });
          })
        )
        .subscribe()
    );
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected direction(localeCode: string): string {
    return Object.prototype.hasOwnProperty.call(Intl.Locale, 'textInfo')
      ? (new Intl.Locale(localeCode) as any).textInfo.direction
      : this.rtlLanguages.includes(localeCode)
      ? 'rtl'
      : 'ltr';
  }
}
