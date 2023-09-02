import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Content, ContentQualifier } from '../models';

/** @deprecated since 1.1 */
export const enum ContentFields {
  Article = 'article',
  Faq = 'faq',
}

/** @deprecated since 1.1 */
export type ContentEntities = (ContentFields | string)[];

export interface ContentService {
  get<T>(
    qualifier: ContentQualifier
  ): Observable<Content<T> | null | undefined>;
  get<T = Record<string, unknown>>(
    qualifier: ContentQualifier
  ): Observable<Content<T> | null | undefined>;
  get(qualifier: ContentQualifier): Observable<Content | null | undefined>;

  getAll<T>(
    qualifier: ContentQualifier
  ): Observable<Content<T>[] | null | undefined>;
  getAll<T = Record<string, unknown>>(
    qualifier: ContentQualifier
  ): Observable<Content<T>[] | null | undefined>;
  getAll(qualifier: ContentQualifier): Observable<Content[] | null | undefined>;

  getState(qualifier: ContentQualifier): Observable<QueryState<Content | null>>;
}

export const ContentService = 'oryx.ContentService';

declare global {
  interface InjectionTokensContractMap {
    [ContentService]: ContentService;
  }
}
