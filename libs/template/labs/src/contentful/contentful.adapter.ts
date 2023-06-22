import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { createClient } from 'contentful';
import { from, map, Observable } from 'rxjs';

export class ContentfulAdapter implements ContentAdapter {
  protected baseEndpoint =
    'https://cdn.contentful.com/spaces/eu6b2pc688zv/environments/master/entries';

  constructor(protected http = inject(HttpService)) {}

  protected client = createClient({
    space: 'eu6b2pc688zv',
    accessToken: 'i2WTlK2mEqyZH7GUdoAdi_OOIqXHyCuBo2tfrjfBulA',
  });

  getKey(qualifier: ContentQualifier): string {
    return qualifier.article ?? '';
  }

  get(qualifier: ContentQualifier): Observable<Content> {
    console.log(qualifier.article);

    return from(
      this.client.getEntries({
        content_type: this.getKey(qualifier),
      })
    ).pipe(
      map((entries) => ({
        article: Object.values(
          entries.items[0].fields as Record<string, string>
        ).reduce((acc, field) => `${acc}\n${field}`, ''),
      }))
    );
  }
}
