import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import {
  ApiCmsModel,
  CmsQualifier,
  CmsToken,
  ExperienceCms,
} from '../../models';
import { CmsAdapter } from './cms.adapter';
import { CmsNormalizer } from './normalizers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFieldByLocale = <T extends Record<string, any>>(
  field: T,
  locale: string
): T extends Record<string, infer Value> ? Value : unknown => {
  if (!field) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }

  const records = Object.values(field);

  return records.length === 1 ? records[0] : field[locale];
};

export class DefaultCmsAdapter implements CmsAdapter {
  constructor(
    protected locale = inject(LocaleService),
    protected cmsToken = inject(CmsToken),
    protected transformer = inject(JsonAPITransformerService),
    protected http = inject(HttpService)
  ) {}

  protected url = 'https://api.contentful.com/spaces/eu6b2pc688zv/entries?';

  getKey(qualifier: CmsQualifier): string {
    return qualifier.id ?? qualifier.query ?? 'page';
  }

  get(qualifier: CmsQualifier): Observable<ExperienceCms> {
    const params = Object.entries(qualifier).reduce((acc, [key, value]) => {
      if (key === 'id') return acc;

      const param = `${key === 'type' ? 'content_type' : key}=${value}`;

      if (!acc.length) {
        return param;
      }

      return `${acc}&${param}`;
    }, '');

    return this.http
      .get<ApiCmsModel.Response>(`${this.url}${params}`, {
        headers: { Authorization: `Bearer ${this.cmsToken}` },
      })
      .pipe(
        switchMap((data) =>
          combineLatest([this.locale.get(), this.locale.getAll(), of(data)])
        ),
        map(([locale, all, data]) => {
          const name = camelize(
            all.find((_locale) => _locale.code === locale)?.name ?? ''
          );

          return {
            data: { attributes: { data, qualifier, locale: name } },
          };
        }),
        this.transformer.do(CmsNormalizer)
      );
  }
}
