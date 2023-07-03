import {
  Content,
  ContentAdapter,
  ContentFields,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import { StoryblokApiService } from './api';

export class StoryblokAdapter implements ContentAdapter {
  constructor(protected storyblok = inject(StoryblokApiService)) {}

  getKey(qualifier: ContentQualifier): string {
    return qualifier.article ?? '';
  }

  get(qualifier: ContentQualifier): Observable<Content> {
    if (!qualifier.entities?.includes(ContentFields.Article)) {
      return of({});
    }

    return this.storyblok
      .getEntries({
        content_type: this.getKey(qualifier),
      })
      .pipe(
        map((entries) => ({
          article: Object.values(entries.items[0].fields).reduce(
            (acc, field) => `${acc}\n${field}`,
            ''
          ),
        }))
      );
  }
}
