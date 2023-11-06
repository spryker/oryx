import { DefaultLocaleService, Locale } from '@spryker-oryx/i18n';
import { Observable, map } from 'rxjs';

export class LabsLocaleService extends DefaultLocaleService {
  getAll(): Observable<Locale[]> {
    return super.getAll().pipe(
      map((locales) => {
        const result = [...locales];
        if (!locales.find((locale) => locale.code === 'ar')) {
          result.push({ code: 'ar', name: 'ar_AR' });
        }

        return result;
      })
    );
  }
}
