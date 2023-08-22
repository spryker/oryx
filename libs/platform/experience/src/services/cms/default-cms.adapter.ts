import { HttpService, TransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import {
  ApiCmsModel,
  CmsEntry,
  CmsModel,
  CmsQualifier,
  CmsToken,
} from '../../models';
import { CmsAdapter } from './cms.adapter';
import { CmsNormalizer } from './normalizers';

export class DefaultCmsAdapter implements CmsAdapter {
  constructor(
    protected locale = inject(LocaleService),
    protected cmsToken = inject(CmsToken),
    protected transformer = inject(TransformerService),
    protected http = inject(HttpService)
  ) {}

  protected url = 'https://api.contentful.com/spaces/eu6b2pc688zv';

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
        headers: { Authorization: `Bearer ${this.cmsToken}` },
      }),
      this.getContentType(qualifier.type),
      this.locale.get(),
      this.locale.getAll(),
    ]).pipe(
      map(([data, type, code, all]) => {
        const locale = all
          .find((_locale) => _locale.code === code)
          ?.name.replace('_', '-');

        return { data, qualifier, locale, type };
      }),
      this.transformer.do(CmsNormalizer)
    ) as Observable<CmsModel<T>>;
  }

  create(qualifier: CmsQualifier): Observable<ApiCmsModel.ContentType> {
    return this.get<CmsEntry>({ id: qualifier.id, type: 'article' }).pipe(
      switchMap((data) => {
        const version = data.items.find(
          (item) => item.id === qualifier.id
        )?.version;

        return this.http.request<ApiCmsModel.ContentType>(
          `${this.url}/entries/${qualifier.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.cmsToken}`,
              'X-Contentful-Content-Type': qualifier.type,
              'X-Contentful-Version': `${version ?? 1}`,
            },
            method: 'PUT',
            body: JSON.stringify({
              fields: {
                ...qualifier.body,
                id: {
                  'en-US': qualifier.id,
                },
              },
            }),
          }
        );
      }),
      switchMap((create) => {
        return this.http.request<ApiCmsModel.ContentType>(
          `${this.url}/entries/${qualifier.id}/published`,
          {
            headers: {
              Authorization: `Bearer ${this.cmsToken}`,
              'X-Contentful-Version': `${create.sys.version}`,
            },
            method: 'PUT',
          }
        );
      })
    );
  }

  protected getContentType(type: string): Observable<ApiCmsModel.ContentTypes> {
    return this.http.get<ApiCmsModel.ContentTypes>(
      `${this.url}/content_types?name=${type}`,
      {
        headers: { Authorization: `Bearer ${this.cmsToken}` },
      }
    );
  }
}
