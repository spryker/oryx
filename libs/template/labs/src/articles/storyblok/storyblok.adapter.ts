import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import { StoryblokClientService, StoryblokContentFields } from './client';

export class StoryblokAdapter implements ContentAdapter {
  constructor(protected storyblok = inject(StoryblokClientService)) {}

  getKey(qualifier: ContentQualifier): string {
    return `${qualifier.id ?? ''}${qualifier.type ?? ''}`;
  }

  get(qualifier: ContentQualifier): Observable<Content> {
    if (
      !qualifier.entities?.includes(StoryblokContentFields.Faq) ||
      qualifier.type !== StoryblokContentFields.Faq
    ) {
      return of({} as Content);
    }

    return this.storyblok
      .getEntry({
        slug: `${qualifier.type}/${qualifier.id}`,
      })
      .pipe(
        map((entry) => ({
          heading: entry.story.content.heading,
          description: entry.story.content.description,
          content: entry.story.content.content,
        }))
      );
  }
}
