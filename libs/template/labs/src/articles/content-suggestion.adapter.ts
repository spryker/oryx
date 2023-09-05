import { ContentService } from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { Observable, map } from 'rxjs';
import { ArticleContent } from './article.model';

export class ContentSuggestionAdapter implements SuggestionAdapter {
  constructor(protected content = inject(ContentService)) {}

  getKey(qualifier: SuggestionQualifier): string {
    return qualifier.query ?? '';
  }

  get(qualifier: SuggestionQualifier): Observable<Suggestion> {
    return this.content
      .getAll<ArticleContent>({
        query: this.getKey({ query: qualifier.query }),
        entities: qualifier.entities,
      })
      .pipe(
        map((data) => ({
          [SuggestionField.Contents]: data?.map((entry) => ({
            name: entry.fields.heading ?? entry.name,
            id: entry.fields.id,
            type: entry.type,
          })),
        }))
      );
  }
}
