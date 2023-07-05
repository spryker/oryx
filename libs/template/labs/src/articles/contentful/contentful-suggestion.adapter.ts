import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { SemanticLinkType } from '@spryker-oryx/site';
import { map, Observable, of } from 'rxjs';
import { ContentfulClientService } from './client';

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (!entities?.includes(SuggestionField.Articles)) {
      return of({});
    }

    return this.contentful
      .searchEntries({
        query: this.getKey({ query }),
      })
      .pipe(
        map((data) => data.items.map((entry) => entry.fields.id)),
        map((names) => ({
          [SuggestionField.Articles]: names?.map((name) => ({
            name,
            id: name,
            type: SemanticLinkType.Article,
          })),
        }))
      );
  }
}
