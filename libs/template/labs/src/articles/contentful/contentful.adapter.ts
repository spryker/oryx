import {
  Content,
  ContentAdapter,
  ContentFields,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import { ContentfulApiService } from './api';

export class ContentfulAdapter implements ContentAdapter {
  constructor(protected contentful = inject(ContentfulApiService)) {}

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
          const field = entries.items.find(
            (entry) => entry.fields.id === qualifier.id
          );

          if (!field) {
            return null;
          }

          return {
            heading: field?.fields.heading,
            description: field?.fields.description,
            content: field?.fields.content,
          };
        })
      );
  }
}
