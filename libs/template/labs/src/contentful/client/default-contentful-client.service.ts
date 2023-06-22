import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { inject } from '@spryker-oryx/di';
import { createClient } from 'contentful';
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
    protected contentfulSpace = inject(ContentfulSpace)
  ) {}

  protected client = createClient({
    space: this.contentfulSpace,
    accessToken: this.contentfulToken,
  });

  getEntries(search: ContentfulSearch): ContentfulResult {
    return ssrAwaiter(this.client.getEntries(search));
  }
}
