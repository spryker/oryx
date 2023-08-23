import { Observable } from 'rxjs';

export const StoryblokToken = 'oryx.StoryblokToken';
export const StoryblokClientService = 'oryx.StoryblokClientService';

declare global {
  interface Environment {
    readonly ORYX_STORYBLOK_TOKEN?: string;
  }
}

export const enum StoryblokContentFields {
  Faq = 'faq',
}

export interface StoryblokSearch {
  slug?: string;
  query?: string;
  type?: string;
}

interface StoryblokContent {
  content: {
    component: string;
    content: string;
    description: string;
    heading: string;
    id: string;
    _uid: string;
  };
}

export interface StoryblokEntryResponse {
  story: StoryblokContent;
}

export interface StoryblokEntriesResponse {
  stories: StoryblokContent[];
}

export interface StoryblokClientService {
  getEntries(
    search: StoryblokSearch
  ): Observable<StoryblokEntriesResponse | null>;
  getEntry(search: StoryblokSearch): Observable<StoryblokEntryResponse | null>;
}

declare global {
  interface InjectionTokensContractMap {
    [StoryblokClientService]: StoryblokClientService;
  }
}
