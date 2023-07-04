import {
  Content,
  ContentAdapter,
  ContentFields,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import { ContentfulClientService } from './client';

export class ContentfulAdapter implements ContentAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey(qualifier: ContentQualifier): string {
    return `${qualifier.id ?? ''}${qualifier.type ?? ''}`;
  }

  get(qualifier: ContentQualifier): Observable<Content | null> {
    if (
      !qualifier.entities?.includes(ContentFields.Article) ||
      qualifier.type !== ContentFields.Article
    ) {
      return of(null);
    }

    return this.contentful
      .getEntries({
        content_type: qualifier.type,
      })
      .pipe(
        map((entries) => {
          const entry = entries.items.find(
            (entry) => entry.fields.id === qualifier.id
          );

          if (!entry) {
            return null;
          }

          return {
            heading: entry?.fields.heading,
            description: entry?.fields.description,
            content: entry?.fields.content,
          };
        })
      );
  }
}
