import { Observable } from 'rxjs';
import { Content, ContentEntity, ContentQualifier } from '../../models';

export const ContentAdapter = 'oryx.ContentAdapter*';
export const ContentConfig = 'oryx.ContentConfig*';

export interface ContentAdapter {
  /**
   * @deprecated Since version 1.1. Will be removed.
   */
  getKey(qualifier: ContentQualifier): string;
  getAll(qualifier: ContentQualifier): Observable<Content[] | null>;
  get(qualifier: ContentQualifier): Observable<Content | null>;
}

export interface ContentConfig {
  [cms: string]: {
    types: ContentEntity[];
    defaultType?: ContentEntity;
  };
}

declare global {
  interface InjectionTokensContractMap {
    [ContentAdapter]: ContentAdapter;
    [ContentConfig]: ContentConfig;
  }
}
