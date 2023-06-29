import { inject } from '@spryker-oryx/di';
import {
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { map, Observable, of } from 'rxjs';
import { ContentfulApiService, ContentfulResult } from './api';

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected contentful = inject(ContentfulApiService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get<T = ContentfulResult>({
    query,
    entities,
  }: SuggestionQualifier): Observable<T> {
    if (!entities?.includes(SuggestionField.Articles)) {
      return of([]) as unknown as Observable<T>;
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
            url: name,
          })),
        }))
      ) as unknown as Observable<T>;
  }
}
