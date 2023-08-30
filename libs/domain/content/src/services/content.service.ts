import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Content, ContentQualifier } from '../models';

export const enum ContentFields {
  Article = 'article',
  Faq = 'faq',
}

export type ContentEntities = (ContentFields | string)[];

export interface ContentService {
  get<T = Record<string, unknown>>(
    qualifier: ContentQualifier
  ): Observable<Content<T> | null | undefined>;
  getAll<T = Record<string, unknown>>(
    qualifier: ContentQualifier
  ): Observable<Content<T>[] | null | undefined>;
  getState(qualifier: ContentQualifier): Observable<QueryState<Content | null>>;
}

export const ContentService = 'oryx.ContentService';

declare global {
  interface InjectionTokensContractMap {
    [ContentService]: ContentService;
  }
}
