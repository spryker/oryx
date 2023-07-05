import { inject } from '@spryker-oryx/di';
import {
  Suggestion,
  SuggestionAdapter,
  SuggestionField,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { SemanticLinkType } from '@spryker-oryx/site';
import { map, Observable, of } from 'rxjs';
import { StoryblokClientService, StoryblokContentFields } from './client';

export class DefaultStoryblokSuggestionAdapter implements SuggestionAdapter {
  constructor(protected storyblok = inject(StoryblokClientService)) {}

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query, entities }: SuggestionQualifier): Observable<Suggestion> {
    if (
      entities?.includes(SuggestionField.Articles) ||
      entities?.includes(StoryblokContentFields.Faq)
    ) {
      return this.storyblok.getEntries({ query }).pipe(
        map((data) => ({
          [SuggestionField.Articles]: data.stories?.map((story) => ({
            id: story.content.id,
            name: story.content.heading,
            type: SemanticLinkType.Faq,
          })),
        }))
      );
    }

    return of({});
  }
}
