import {
  ElementResolver,
  PageMetaResolver,
  ResolverScore,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { map, Observable, of } from 'rxjs';

export class LangPageMetaResolver implements PageMetaResolver {
  constructor(protected localeService = inject(LocaleService, null)) {}

  getScore(): Observable<number> {
    return of(ResolverScore.Default);
  }

  resolve(): Observable<ElementResolver> {
    if (!this.localeService?.get()) {
      return of({});
    }

    return this.localeService.get().pipe(
      map((lang: string) => ({
        name: 'html',
        attrs: {
          lang,
        },
      }))
    );
  }
}
