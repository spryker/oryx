import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, of, tap } from 'rxjs';

export const LocaleMetaInitializer = `${AppInitializer}LocaleMeta`;

export class DefaultLocaleMetaInitializer implements AppInitializer {
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

  initialize(): Observable<string> {
    if (!this.localeService?.get() || !this.metaService) {
      return of('');
    }

    return this.localeService.get().pipe(
      tap((lang: string) => {
        this.metaService?.setHtmlAttributes({
          lang,
          dir: this.direction(lang),
        });
      })
    );
  }

  protected direction(localeCode: string): string {
    return Object.prototype.hasOwnProperty.call(Intl.Locale, 'textInfo')
      ? (new Intl.Locale(localeCode) as any).textInfo.direction
      : this.rtlLanguages.includes(localeCode)
      ? 'rtl'
      : 'ltr';
  }
}
