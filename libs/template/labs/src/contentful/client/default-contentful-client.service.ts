import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  ContentfulClientService,
  ContentfulResult,
  ContentfulSearch,
  ContentfulSpace,
  ContentfulToken,
} from './contentful-client.service';

export class DefaultContentfulClientService implements ContentfulClientService {
  constructor(
    protected contentfulToken = inject(ContentfulToken),
    protected contentfulSpace = inject(ContentfulSpace),
    protected http = inject(HttpService)
  ) {}

  getEntries(search: ContentfulSearch): ContentfulResult {
    const params = Object.entries(search).reduce((acc, [key, value]) => {
      const param = `${key}=${value}`;
      if (!acc.length) {
        return param;
      }

      return `${acc}&${param}`;
    }, '');

    return this.http.get(
      `https://cdn.contentful.com/spaces/${this.contentfulSpace}/environments/master/entries?${params}`,
      {
        headers: {
          Authorization: `Bearer ${this.contentfulToken}`,
        },
      }
    );
  }
}
