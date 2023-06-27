import { inject } from '@spryker-oryx/di';
import { SuggestionAdapter, SuggestionQualifier } from '@spryker-oryx/search';
import { map, Observable, of } from 'rxjs';
import { ContentfulClientService, ContentfulResult } from '../client';

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get<T = ContentfulResult>({
    query,
    entries,
  }: SuggestionQualifier): Observable<T> {
    if (!entries?.includes('contentful')) {
      return of([]) as unknown as Observable<T>;
    }

    return this.contentful
      .getEntries({
        query: this.getKey({ query }),
      })
      .pipe(
        map((entries) => ({
          contentful: entries.items.map((entry) => ({
            name: entry.sys.contentType.sys.id,
          })),
        }))
      ) as unknown as Observable<T>;
  }
}
