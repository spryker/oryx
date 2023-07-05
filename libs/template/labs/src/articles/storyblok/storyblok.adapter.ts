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
    );
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
      );
  }
}
