import { HttpService, TransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, combineLatest, map } from 'rxjs';
import {
  ApiCmsModel,
  CmsModel,
  CmsQualifier,
  ContentfulSpace,
  ContentfulToken,
} from '../../models';
import { CmsAdapter } from './cms.adapter';
import { CmsNormalizer } from './normalizers';

export class ContentfulCmsAdapter implements CmsAdapter {
  constructor(
    protected locale = inject(LocaleService),
    protected token = inject(ContentfulToken),
    protected space = inject(ContentfulSpace),
    protected transformer = inject(TransformerService),
    protected http = inject(HttpService)
  ) {}

  protected url = `https://api.contentful.com/spaces/${this.space}`;

  getKey(qualifier: CmsQualifier): string {
    return qualifier.id ?? qualifier.query ?? 'page';
  }

  get<T = Record<string, unknown>>(
    qualifier: CmsQualifier
  ): Observable<CmsModel<T>> {
    const params = Object.entries(qualifier).reduce((acc, [key, value]) => {
      if (key === 'id') return acc;

      const param = `${key === 'type' ? 'content_type' : key}=${value}`;

      if (!acc.length) {
        return param;
      }

      return `${acc}&${param}`;
    }, '');

    return combineLatest([
      this.http.get<ApiCmsModel.Response>(`${this.url}/entries?${params}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      }),
      this.getContentType(qualifier.type),
      this.getLocalLocale(),
    ]).pipe(
      map(([data, type, locale]) => ({ data, qualifier, locale, type })),
      this.transformer.do(CmsNormalizer)
    ) as Observable<CmsModel<T>>;
  }

  protected getLocalLocale(): Observable<string> {
    return combineLatest([this.locale.get(), this.locale.getAll()]).pipe(
      map(
        ([code, all]) =>
          all
            .find((_locale) => _locale.code === code)
            ?.name.replace('_', '-') ?? ''
      )
    );
  }

  protected getContentType(
    type: string
  ): Observable<Record<string, ApiCmsModel.ContentField>> {
    return this.http
      .get<ApiCmsModel.ContentTypes>(`${this.url}/content_types?name=${type}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .pipe(
        map((data) =>
          data.items[0].fields.reduce(
            (acc, field) => ({ ...acc, [field.id]: field }),
            {}
          )
        )
      );
  }

  protected getCmsLocales(): Observable<ApiCmsModel.Locale[]> {
    return this.http
      .get<ApiCmsModel.Locales>(`${this.url}/locales`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .pipe(map((data) => data.items));
  }
}
