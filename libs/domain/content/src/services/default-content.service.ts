import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { Observable, of } from 'rxjs';
import { Content, ContentQualifier } from '../models';
import { ContentAdapter } from './content.adapter';
import { ContentService } from './content.service';

export class DefaultContentService implements ContentService {
  constructor(protected adapter = inject(ContentAdapter, null)) {}

  protected contentQuery = createQuery<Content | null, ContentQualifier>({
    loader: (q: ContentQualifier) => this.adapter?.get(q) ?? of(null),
    refreshOn: [LocaleChanged],
  });

  get(qualifier: ContentQualifier): Observable<Content | null | undefined> {
    return this.contentQuery.get(qualifier);
  }

  getState(
    qualifier: ContentQualifier
  ): Observable<QueryState<Content | null>> {
    return this.contentQuery.getState(qualifier);
  }
}
