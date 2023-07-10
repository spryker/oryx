import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Content, ContentQualifier } from '../models';

export const enum ContentFields {
  Article = 'article',
  Faq = 'faq',
}

export type ContentEntities = (ContentFields | string)[];

export interface ContentService {
  get(qualifier: ContentQualifier): Observable<Content | null | undefined>;
  getAll(qualifier: ContentQualifier): Observable<Content[] | null | undefined>;
  getState(qualifier: ContentQualifier): Observable<QueryState<Content | null>>;
}

export const ContentService = 'oryx.ContentService';

declare global {
  interface InjectionTokensContractMap {
    [ContentService]: ContentService;
  }
}
