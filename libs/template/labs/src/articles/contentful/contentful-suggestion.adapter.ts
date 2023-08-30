import { ContentService } from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { Observable, map } from 'rxjs';
import { ContentfulContentFields } from './contentful.model';

interface CmsSuggestion {
  heading: string;
}

export class DefaultContentfulSuggestionAdapter implements SuggestionAdapter {
  constructor(protected content = inject(ContentService)) {}

  getKey(qualifier: SuggestionQualifier): string {
    return qualifier.query ?? '';
  }

  get(qualifier: SuggestionQualifier): Observable<Suggestion> {
    return this.content
      .getAll<CmsSuggestion>({
        query: this.getKey({ query: qualifier.query }),
        type: ContentfulContentFields.Article,
        entities: qualifier.entities,
      })
      .pipe(
        map((data) => ({
          [SuggestionField.Contents]: data?.map((entry) => ({
            name: entry.fields.heading,
            id: entry.fields.id,
            type: ContentfulContentFields.Article,
          })),
        }))
      );
  }
}
