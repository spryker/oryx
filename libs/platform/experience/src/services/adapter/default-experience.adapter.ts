import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import { Component, ExperienceQualifier } from '../../models';
import { CmsAdapter } from '../cms';
import { ContentBackendUrl } from '../experience-tokens';
import { ExperienceAdapter } from './experience.adapter';

export class DefaultExperienceAdapter implements ExperienceAdapter {
  constructor(
    protected backendUrl = inject(ContentBackendUrl),
    protected cms = inject(CmsAdapter, null),
    protected http = inject(HttpService)
  ) {}

  protected url = `${this.backendUrl}/components/`;

  getKey(qualifier: ExperienceQualifier): string {
    return qualifier.id ?? '';
  }

  get(qualifier: ExperienceQualifier): Observable<Component | null> {
    if (this.cms) {
      return this.cms.get({ type: 'component' }).pipe(
        map(
          ({ components }) =>
            components?.find((component) => {
              const toCompare = qualifier.id
                ? component.id
                : component.meta?.route;
              return toCompare === (qualifier.id ?? qualifier.route);
            }) ?? null
        )
      );
    }

    const part = qualifier.id
      ? encodeURIComponent(qualifier.id)
      : `?meta.route=${encodeURIComponent(qualifier.route ?? '')}`;

    return this.http.get<Component>(`${this.url}${part}`);
  }
}
