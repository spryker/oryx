import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import { ContentfulClientService, ContentfulContentFields } from './client';

export class ContentfulAdapter implements ContentAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey(qualifier: ContentQualifier): string {
    return qualifier.id ?? qualifier.type ?? '';
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    if (qualifier.type !== ContentfulContentFields.Article) {
      return of(null);
    }

    return this.contentful
      .getEntries({
        content_type: qualifier.type,
      })
      .pipe(
        map((entries) =>
          entries.items.map((entry) => ({
            id: entry.fields.id,
            heading: entry.fields.heading,
            description: entry.fields.description,
            content: entry.fields.content,
            url: `/article/${encodeURIComponent(entry.fields.id)}`,
          }))
        )
      );
  }

  get(qualifier: ContentQualifier): Observable<Content | null> {
    return this.getAll(qualifier).pipe(
      map(
        (entries) => entries?.find((entry) => entry.id === qualifier.id) ?? null
      )
    );
  }
}
