import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { map, Observable, of } from 'rxjs';
import { ContentfulApiService } from './api';

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected contentful = inject(ContentfulApiService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (!entities?.includes(SuggestionField.Articles)) {
      return of({});
    }

    return this.contentful
      .getEntries({
        query: this.getKey({ query }),
      })
      .pipe(
        map((data) => data.items.map((entry) => entry.sys.contentType.sys.id)),
        map((names) => ({
          [SuggestionField.Articles]: names?.map((name) => ({
            name,
            id: name,
          })),
        }))
      );
  }
}
