import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Component } from '@spryker-oryx/utilities';
import {
  ContentfulSpace,
  ContentfulToken,
} from 'libs/template/labs/src/articles';
import { Observable, map } from 'rxjs';
import { ExperienceQualifier } from '../../models';
import { ExperienceAdapter } from './experience.adapter';

export class CmsExperienceAdapter implements ExperienceAdapter {
  constructor(
    protected contentfulToken = inject(ContentfulToken),
    protected contentfulSpace = inject(ContentfulSpace),
    protected http = inject(HttpService)
  ) {}

  getKey(qualifier: ExperienceQualifier): string {
    return qualifier.id ?? '';
  }

  getAll(): Observable<Component[] | null> {
    return this.http
      .get<any>(
        `https://cdn.contentful.com/spaces/${this.contentfulSpace}/entries??content_type=page`,
        {
          headers: {
            Authorization: `Bearer ${this.contentfulToken}`,
          },
        }
      )
      .pipe(
        map((pages) => {
          console.log(pages);
          return pages;
        })
      );
  }

  get(qualifier: ExperienceQualifier): Observable<Component | null> {
    return this.getAll().pipe(
      map(
        (entries) => entries?.find((entry) => entry.id === qualifier.id) ?? null
      )
    );
  }
}
