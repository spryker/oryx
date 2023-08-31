import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Component,
  ExperienceAdapter,
  ExperienceQualifier,
} from '@spryker-oryx/experience';
import { Observable, map } from 'rxjs';
import { ContentService } from '../content.service';

export interface CmsComponent {
  data: Component;
}

export class ContentExperienceAdapter implements ExperienceAdapter {
  constructor(
    protected content = inject(ContentService),
    protected http = inject(HttpService)
  ) {}

  getKey(qualifier: ExperienceQualifier): string {
    return qualifier.id ?? '';
  }

  get(qualifier: ExperienceQualifier): Observable<Component | null> {
    return this.getAll().pipe(
      map(
        (data) =>
          data?.find((_component) => {
            const toCompare = qualifier.id
              ? _component.id
              : _component.meta?.route;

            return toCompare === (qualifier.id ?? qualifier.route);
          }) ?? null
      )
    );
  }

  getAll(): Observable<Component[] | null> {
    return this.content
      .getAll<CmsComponent>({ type: 'component', entities: ['component'] })
      .pipe(
        map(
          (items) =>
            items?.map((item) => ({
              ...item.fields.data,
              id: item.fields.id,
            })) ?? null
        )
      );
  }
}
