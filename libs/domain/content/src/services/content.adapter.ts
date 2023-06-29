import { Observable } from 'rxjs';
import { Content, ContentQualifier } from '../models';

export interface ContentAdapter {
  getKey(qualifier: ContentQualifier): string;
  get(qualifier: ContentQualifier): Observable<Content>;
}

export const ContentAdapter = 'oryx.ContentAdapter*';

declare global {
  interface InjectionTokensContractMap {
    [ContentAdapter]: ContentAdapter;
  }
}
