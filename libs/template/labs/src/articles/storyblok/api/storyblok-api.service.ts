import { Observable } from 'rxjs';

export const StoryblokToken = 'oryx.StoryblokSpace';
export const StoryblokApiService = 'oryx.StoryblokApiService';

declare global {
  interface Environment {
    readonly ORYX_STORYBLOK_TOKEN?: string;
  }
}

export interface StoryblokSearch {
  content_type?: string;
  query?: string;
}

export interface StoryblokResponse {
  items: {
    sys: {
      contentType: { sys: { id: string } };
    };
    fields: Record<string, string>;
  }[];
}

export interface StoryblokApiService {
  getEntries(search: StoryblokSearch): Observable<StoryblokResponse>;
}

declare global {
  interface InjectionTokensContractMap {
    [StoryblokApiService]: StoryblokApiService;
  }
}
