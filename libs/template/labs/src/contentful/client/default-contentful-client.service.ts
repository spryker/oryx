import { inject } from '@spryker-oryx/di';
import {
  ChainModifiers,
  createClient,
  EntryCollection,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful';
import { from, Observable } from 'rxjs';
import {
  ContentfulClientService,
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

  getEntries(
    type: string
  ): Observable<
    EntryCollection<EntrySkeletonType, ChainModifiers, LocaleCode>
  > {
    return from(
      this.client.getEntries({
        content_type: type,
      })
    );
  }
}
