import { inject } from '@spryker-oryx/di';
import { CmsAdapter } from '@spryker-oryx/experience';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { Observable, map, of } from 'rxjs';
import { ContentfulContentFields } from './contentful.model';

interface CmsSuggestion {
  heading: string;
}

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected cmsAdapter = inject(CmsAdapter)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (
      entities?.includes(SuggestionField.Contents) ||
      entities?.includes(ContentfulContentFields.Article)
    ) {
      return this.cmsAdapter
        .get<CmsSuggestion>({
          query: this.getKey({ query }),
          type: ContentfulContentFields.Article,
        })
        .pipe(
          map((data) => ({
            [SuggestionField.Contents]: data.items.map((entry) => ({
              name: entry.heading,
              id: entry.id,
              type: ContentfulContentFields.Article,
            })),
          }))
        );
    }

    return of({});
  }
}
