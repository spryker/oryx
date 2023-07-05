import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { map, Observable, of } from 'rxjs';
import { ContentfulClientService, ContentfulContentFields } from './client';

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (
      entities?.includes(SuggestionField.Contents) ||
      entities?.includes(ContentfulContentFields.Article)
    ) {
      return this.contentful
        .getEntries({
          query: this.getKey({ query }),
        })
        .pipe(
          map((data) => ({
            [SuggestionField.Contents]: data.items.map((entry) => ({
              name: entry.fields.heading,
              id: entry.fields.id,
              url: `/article/${encodeURIComponent(entry.fields.id)}`,
            })),
          }))
        );
    }

    return of({});
  }
}
