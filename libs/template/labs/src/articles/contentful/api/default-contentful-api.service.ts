import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { combineLatest, Observable, switchMap } from 'rxjs';
import {
  ContentfulApiService,
  ContentfulResponse,
  ContentfulSearch,
  ContentfulSpace,
  ContentfulToken,
} from './contentful-api.service';

export class DefaultContentfulApiService implements ContentfulApiService {
  constructor(
    protected contentfulToken = inject(ContentfulToken),
    protected contentfulSpace = inject(ContentfulSpace),
    protected locale = inject(LocaleService),
    protected http = inject(HttpService)
  ) {}

  getEntries(search: ContentfulSearch): Observable<ContentfulResponse> {
    const params = Object.entries(search).reduce((acc, [key, value]) => {
      const param = `${key}=${value}`;
      if (!acc.length) {
        return param;
      }

      return `${acc}&${param}`;
    }, '');

    return combineLatest([this.locale.get(), this.locale.getAll()]).pipe(
      switchMap(([locale, all]) => {
        const name = all
          .find((_locale) => _locale.code === locale)
          ?.name.replace('_', '-');

        return this.http.get<ContentfulResponse>(
          `https://cdn.contentful.com/spaces/${this.contentfulSpace}/entries?${params}&locale=${name}`,
          {
            headers: {
              Authorization: `Bearer ${this.contentfulToken}`,
            },
          }
        );
      })
    );
  }
}
