import {
  Content,
  ContentAdapter,
  ContentFields,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { SemanticLinkType } from '@spryker-oryx/site';
import { map, Observable, of } from 'rxjs';
import { ContentfulClientService } from './client';

export class ContentfulAdapter implements ContentAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey(qualifier: ContentQualifier): string {
    return qualifier.id ?? qualifier.type ?? '';
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    if (qualifier.type !== ContentFields.Article) {
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
            type: SemanticLinkType.Article,
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
