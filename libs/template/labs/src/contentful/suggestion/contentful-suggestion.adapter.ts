import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { map, Observable } from 'rxjs';
import { ContentfulClientService } from '../client';

export const ContentfulSuggestionAdapter = 'oryx.ContentfulSuggestionAdapter';

declare global {
  interface InjectionTokensContractMap {
    [ContentfulSuggestionAdapter]: SuggestionAdapter;
  }
}

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query }: SuggestionQualifier): Observable<Suggestion> {
    return this.contentful
      .getEntries({
        query: this.getKey({ query }),
      })
      .pipe(
        map((entries) => ({
          cmsPages: entries.items.map((entry) => ({
            name: entry.sys.contentType.sys.id,
          })),
        }))
      );
  }
}
