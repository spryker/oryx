import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Component,
  ExperienceAdapter,
  ExperienceQualifier,
} from '@spryker-oryx/experience';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { Content, ContentFields } from '../../models';
import { ContentService } from '../content.service';

export interface ContentComponent {
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
    return this.content
      .get<ContentComponent>({
        id:
          qualifier.id ??
          (qualifier.route?.startsWith('/')
            ? qualifier.route?.substring(1)
            : qualifier.route),
        type: ContentFields.Component,
        entities: [ContentFields.Component],
      })
      .pipe(
        switchMap((item) => {
          if (item) {
            return of(item).pipe(map(this.normalizeData));
          }

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
        })
      );
  }

  getAll(): Observable<Component[] | null> {
    return this.content
      .getAll<ContentComponent>({
        type: ContentFields.Component,
        entities: [ContentFields.Component],
      })
      .pipe(
        switchMap((items) => {
          const normalized: Observable<Component | null>[] = [];
          const needInfo$: Observable<Component | null>[] = [];

          for (const item of items ?? []) {
            if (item.fields.data) {
              normalized.push(of(this.normalizeData(item)));

              continue;
            }

            needInfo$.push(this.get({ id: item.fields.id }));
          }

          if (needInfo$.length) {
            return combineLatest([...needInfo$, ...normalized]);
          }

          return combineLatest(normalized);
        }),
        map((data) => data.filter(Boolean) as Component[])
      );
  }

  protected normalizeData(content: Content<ContentComponent>): Component {
    const data =
      typeof content.fields.data === 'string'
        ? JSON.parse(content.fields.data)
        : content.fields.data;

    return {
      ...data,
      id: content.fields.id,
    };
  }
}
