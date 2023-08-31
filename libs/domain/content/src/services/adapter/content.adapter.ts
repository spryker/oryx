import { Observable } from 'rxjs';
import { Content, ContentQualifier } from '../../models';

export const ContentAdapter = 'oryx.ContentAdapter*';
export const ContentConfig = 'oryx.ContentConfig*';

export interface ContentAdapter {
  getName(): string;
  getKey(qualifier: ContentQualifier): string;
  getAll(qualifier: ContentQualifier): Observable<Content[] | null>;
  get(qualifier: ContentQualifier): Observable<Content | null>;
}

export interface ContentConfig {
  [cms: string]: {
    types: string[];
  };
}

declare global {
  interface InjectionTokensContractMap {
    [ContentAdapter]: ContentAdapter;
    [ContentConfig]: ContentConfig;
  }
}
