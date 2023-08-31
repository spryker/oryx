import { inject } from '@spryker-oryx/di';
import {
  DefaultLocaleAdapter,
  DefaultLocaleAdapterConfig,
  Locale,
} from '@spryker-oryx/i18n';
import { Observable, catchError, filter, map, of, switchMap } from 'rxjs';
import { StoreService } from '../../store';

export class SapiLocaleAdapter extends DefaultLocaleAdapter {
  constructor(
    config = inject(DefaultLocaleAdapterConfig, null),
    protected readonly storeService = inject(StoreService)
  ) {
    super(config);
  }

  override getAll(): Observable<Locale[]> {
    return this.storeService.get().pipe(
      filter(Boolean),
      map((response) => response.locales),
      catchError(() => this.getFallbackLocales())
    );
  }

  override getDefault(): Observable<string> {
    return this.getAll().pipe(map((locales) => locales[0].code));
  }

  protected getFallbackLocales(): Observable<Locale[]> {
    return super
      .getAll()
      .pipe(
        switchMap((locales) =>
          locales.length
            ? of(locales)
            : super
                .getDefault()
                .pipe(map((lang) => [{ code: lang, name: lang }]))
        )
      );
  }
}
