import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { map, Observable, of } from 'rxjs';
import { StoryblokApiService } from './api';

export class DefaultStoryblokSuggestionAdapter implements SuggestionAdapter {
  constructor(protected storyblok = inject(StoryblokApiService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (!entities?.includes(SuggestionField.Articles)) {
      return of({});
    }

    return this.storyblok.getEntries({ query }).pipe(
      map((data) => data.stories.map((story) => story.content.heading)),
      map((names) => ({
        [SuggestionField.Articles]: names?.map((name) => ({
          name,
          id: name,
        })),
      }))
    );
  }
}
