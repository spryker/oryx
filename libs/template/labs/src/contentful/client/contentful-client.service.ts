import {
  ChainModifiers,
  EntryCollection,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful';
import { Observable } from 'rxjs';

export const ContentfulToken = 'oryx.ContentfulSpace';
export const ContentfulSpace = 'oryx.ContentfulToken';

declare global {
  interface Environment {
    readonly ORYX_CONTENTFUL_TOKEN?: string;
    readonly ORYX_CONTENTFUL_SPACE?: string;
  }
}

export interface ContentfulSearch {
  content_type?: string;
  query?: string;
}

export type ContentfulResult = Observable<
  EntryCollection<EntrySkeletonType, ChainModifiers, LocaleCode>
>;

export interface ContentfulClientService {
  getEntries(search: ContentfulSearch): ContentfulResult;
}

export const ContentfulClientService = 'oryx.ContentfulClientService';

declare global {
  interface InjectionTokensContractMap {
    [ContentfulClientService]: ContentfulClientService;
  }
}
