import { ContentService } from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionAdapter, SuggestionField } from './suggestion.adapter';

declare global {
  interface ContentFields {
    [SuggestionField.Contents]: undefined;
  }
}

export class ContentSuggestionAdapter implements SuggestionAdapter {
  protected content = inject(ContentService);

  /**
   * @deprecated Since version 1.1. Will be removed.
   */
  getKey(qualifier: SuggestionQualifier): string {
    return qualifier.query ?? '';
  }

  get(qualifier: SuggestionQualifier): Observable<Suggestion> {
    return this.content.getAll(qualifier).pipe(
      map((data) => ({
        [SuggestionField.Contents]: data?.map((entry) => ({
          name: entry.heading ?? entry._meta.name ?? '',
          id: entry.id,
          type: entry._meta.type,
        })),
      }))
    );
  }
}
