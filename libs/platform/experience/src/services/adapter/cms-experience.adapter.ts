import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import {
  ApiExperienceCmsModel,
  CmsToken,
  Component,
  ExperienceQualifier,
} from '../../models';
import { ExperienceAdapter } from './experience.adapter';
import { CmsNormalizer } from './normalizers';

export class CmsExperienceAdapter implements ExperienceAdapter {
  constructor(
    protected cmsToken = inject(CmsToken),
    protected transformer = inject(JsonAPITransformerService),
    protected http = inject(HttpService)
  ) {}

  protected url =
    'https://cdn.contentful.com/spaces/eu6b2pc688zv/entries?content_type=page';

  getKey(qualifier: ExperienceQualifier): string {
    return qualifier.id ?? '';
  }

  getAll(): Observable<Component[] | null> {
    return this.http
      .get<ApiExperienceCmsModel.Response>(this.url, {
        headers: { Authorization: `Bearer ${this.cmsToken}` },
      })
      .pipe(
        map((data) => ({ data: { attributes: data } })),
        this.transformer.do(CmsNormalizer)
      );
  }

  get(qualifier: ExperienceQualifier): Observable<Component | null> {
    return this.getAll().pipe(
      map(
        (pages) =>
          pages?.find((page) => page.meta?.route === qualifier.id) ?? null
      ) ?? null
    );
  }
}
