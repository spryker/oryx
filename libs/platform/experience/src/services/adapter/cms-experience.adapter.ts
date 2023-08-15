import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import {
  ApiExperienceCmsModel,
  CmsToken,
  Component,
  ExperienceCms,
  ExperienceQualifier,
} from '../../models';
import { CmsAdapter } from './experience.adapter';
import { CmsNormalizer } from './normalizers';

export class CmsExperienceAdapter<T = Component> implements CmsAdapter<T> {
  constructor(
    protected locale = inject(LocaleService),
    protected cmsToken = inject(CmsToken),
    protected transformer = inject(JsonAPITransformerService),
    protected http = inject(HttpService)
  ) {}

  protected url = 'https://cdn.contentful.com/spaces/eu6b2pc688zv/entries?';

  getKey(qualifier: ExperienceQualifier): string {
    return qualifier.id ?? qualifier.query ?? 'page';
  }

  getCmsData(qualifier: ExperienceQualifier): Observable<ExperienceCms | null> {
    const params = Object.entries(qualifier).reduce((acc, [key, value]) => {
      if (key === 'id') return acc;

      const param = `${key === 'type' ? 'content_type' : key}=${value}`;

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

        return this.http.get<ApiExperienceCmsModel.Response>(
          `${this.url}${params}&locale=${name}`,
          {
            headers: { Authorization: `Bearer ${this.cmsToken}` },
          }
        );
      }),
      map((data) => ({ data: { attributes: { data, qualifier } } })),
      this.transformer.do(CmsNormalizer)
    );
  }

  get(qualifier: ExperienceQualifier): Observable<T | null> {
    return this.getCmsData(qualifier).pipe(
      map(
        (data) =>
          data?.pages?.find((page) => page.meta?.route === qualifier.id) ?? null
      ) ?? null
    ) as Observable<T | null>;
  }
}
