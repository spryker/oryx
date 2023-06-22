import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { inject } from '@spryker-oryx/di';
import { map, Observable } from 'rxjs';
import { ContentfulClientService } from './client';

export class ContentfulAdapter implements ContentAdapter {
  constructor(protected contentful = inject(ContentfulClientService)) {}

  getKey(qualifier: ContentQualifier): string {
    return qualifier.article ?? '';
  }

  get(qualifier: ContentQualifier): Observable<Content> {
    return this.contentful
      .getEntries({
        content_type: this.getKey(qualifier),
      })
      .pipe(
        map((entries) => ({
          article: Object.values(
            entries.items[0].fields as Record<string, string>
          ).reduce((acc, field) => `${acc}\n${field}`, ''),
        }))
      );
  }
}
