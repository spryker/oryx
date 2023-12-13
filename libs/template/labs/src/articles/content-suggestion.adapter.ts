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

declare global {
  interface DynamicContentFields {
    [SuggestionField.Contents]: undefined;
  }
}

export class ContentSuggestionAdapter implements SuggestionAdapter {
  constructor(protected content = inject(ContentService)) {}

  /**
   * @deprecated Since version 1.1. Will be removed.
   */
  getKey(qualifier: SuggestionQualifier): string {
    return qualifier.query ?? '';
  }

  get(qualifier: SuggestionQualifier): Observable<Suggestion> {
    return this.content.getAll<ArticleContent>(qualifier).pipe(
      map((data) => ({
        [SuggestionField.Contents]: data?.map((entry) => ({
          name: entry.heading ?? entry._meta.name,
          id: entry.id,
          type: entry._meta.type,
        })),
      }))
    );
  }
}
