import { inject } from '@spryker-oryx/di';
import {
  Component,
  ExperienceAdapter,
  ExperienceQualifier,
} from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, map } from 'rxjs';
import { ContentService } from '../content.service';

export interface ContentComponent {
  data: Component;
}

export class ContentExperienceAdapter implements ExperienceAdapter {
  constructor(protected content = inject(ContentService)) {}

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
      .getAll<ContentComponent>({
        type: 'component',
        entities: ['component'],
      })
      .pipe(
        map(
          (items) =>
            items?.map((item) => {
              const id = featureVersion >= '1.4' ? item.id : item.fields?.id;
              const data =
                featureVersion >= '1.4' ? item.data : item.fields?.data;

              return {
                ...(typeof data === 'string' ? JSON.parse(data) : data),
                id,
              };
            }) ?? null
        )
      );
  }
}
