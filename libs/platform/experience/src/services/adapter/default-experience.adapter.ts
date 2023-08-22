import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import { Component, ExperienceQualifier } from '../../models';
import { CmsAdapter } from '../cms';
import { ContentBackendUrl } from '../experience-tokens';
import { ExperienceAdapter } from './experience.adapter';

interface CmsComponent {
  data: Component;
}

export class DefaultExperienceAdapter implements ExperienceAdapter {
  constructor(
    protected backendUrl = inject(ContentBackendUrl),
    protected cms = inject(CmsAdapter, {} as CmsAdapter),
    protected http = inject(HttpService)
  ) {}

  protected url = `${this.backendUrl}/components/`;

  getKey(qualifier: ExperienceQualifier): string {
    return qualifier.id ?? '';
  }

  get(qualifier: ExperienceQualifier): Observable<Component | null> {
    if (this.cms?.get) {
      return this.cms.get<CmsComponent>({ type: 'component' }).pipe(
        map((data) => {
          const component = data.items?.find((_component) => {
            const toCompare = qualifier.id
              ? _component.data.id
              : _component.data.meta?.route;
            return toCompare === (qualifier.id ?? qualifier.route);
          });

          return component ? { ...component?.data, id: component?.id } : null;
        })
      );
    }

    const part = qualifier.id
      ? encodeURIComponent(qualifier.id)
      : `?meta.route=${encodeURIComponent(qualifier.route ?? '')}`;

    return this.http.get<Component>(`${this.url}${part}`);
  }
}
