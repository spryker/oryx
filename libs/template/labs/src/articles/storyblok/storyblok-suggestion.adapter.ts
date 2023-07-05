import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { SemanticLinkType } from '@spryker-oryx/site';
import { map, Observable, of } from 'rxjs';
import { StoryblokClientService } from './client';

export class DefaultStoryblokSuggestionAdapter implements SuggestionAdapter {
  constructor(protected storyblok = inject(StoryblokClientService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    console.log(entities);
    if (
      entities?.includes(SuggestionField.Articles) ||
      entities?.includes('faq')
    ) {
      return this.storyblok.searchEntries({ query }).pipe(
        map((data) => data.stories.map((story) => story.content.id)),
        map((names) => ({
          [SuggestionField.Articles]: names?.map((name) => ({
            name,
            id: name,
            type: SemanticLinkType.Faq,
          })),
        }))
      );
    }

    return of({});
  }
}
