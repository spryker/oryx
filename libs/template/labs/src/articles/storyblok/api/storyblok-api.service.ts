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

export interface StoryblokResponse {
  story: {
    content: {
      component: string;
      content: string;
      description: string;
      heading: string;
      _uid: string;
    };
  };
}

export interface StoryblokApiService {
  getEntries(search: StoryblokSearch): Observable<any>;
  getEntry(search: StoryblokSearch): Observable<StoryblokResponse>;
}

declare global {
  interface InjectionTokensContractMap {
    [StoryblokApiService]: StoryblokApiService;
  }
}
