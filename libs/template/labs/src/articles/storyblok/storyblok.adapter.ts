import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { Observable, map, of } from 'rxjs';
import { StoryblokClientService, StoryblokContentFields } from './client';

// Will be implemented in the next step
export class StoryblokAdapter implements ContentAdapter {
  constructor(protected storyblok = inject(StoryblokClientService)) {}

  getName(): string {
    return 'asfasf';
  }

  getKey(qualifier: ContentQualifier): string {
    return qualifier.id ?? qualifier.type ?? '';
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    if (qualifier.type !== StoryblokContentFields.Faq) {
      return of(null);
    }

    return this.storyblok.getEntries({ type: qualifier.type }).pipe(
      map((entries) =>
        entries.stories.map((entry) => ({
          id: entry.content.id,
          heading: entry.content.heading,
          description: entry.content.description,
          content: entry.content.content,
          url: `/${StoryblokContentFields.Faq}/${encodeURIComponent(
            entry.content.id
          )}`,
        }))
      )
    ) as any;
  }

  get(qualifier: ContentQualifier): Observable<Content | null> {
    if (qualifier.type !== StoryblokContentFields.Faq) {
      return of(null);
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
      ) as any;
  }
}
