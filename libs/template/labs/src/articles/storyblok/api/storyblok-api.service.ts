import { Observable } from 'rxjs';

export const StoryblokToken = 'oryx.StoryblokToken';
export const StoryblokApiService = 'oryx.StoryblokApiService';

declare global {
  interface Environment {
    readonly ORYX_STORYBLOK_TOKEN?: string;
  }
}

export interface StoryblokSearch {
  slug?: string;
  query?: string;
}

interface StoryblokContent {
  content: {
    component: string;
    content: string;
    description: string;
    heading: string;
    _uid: string;
  };
}

export interface StoryblokEntryResponse {
  story: StoryblokContent;
}

export interface StoryblokEntriesResponse {
  stories: StoryblokContent[];
}

export interface StoryblokApiService {
  getEntries(search: StoryblokSearch): Observable<StoryblokEntriesResponse>;
  getEntry(search: StoryblokSearch): Observable<StoryblokEntryResponse>;
}

declare global {
  interface InjectionTokensContractMap {
    [StoryblokApiService]: StoryblokApiService;
  }
}
