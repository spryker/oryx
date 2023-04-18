import { ElementResolver, PageMetaResolver } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { map, Observable, of } from 'rxjs';

export class DirectionalityPageMetaResolver implements PageMetaResolver {
  constructor(protected localeService = inject(LocaleService, null)) {}

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

  getScore(): Observable<number> {
    return of(0);
  }

  resolve(): Observable<ElementResolver> {
    if (!this.localeService?.get()) {
      return of({});
    }

    return this.localeService
      .get()
      .pipe(map((locale: string) => this.setDirection(locale)));
  }

  protected setDirection(localeCode: string): ElementResolver {
    const dir = Object.prototype.hasOwnProperty.call(Intl.Locale, 'textInfo')
      ? (new Intl.Locale(localeCode) as any).textInfo.direction
      : this.rtlLanguages.includes(localeCode)
      ? 'rtl'
      : 'ltr';

    return {
      name: 'html',
      attrs: {
        dir,
      },
    };
  }
}
