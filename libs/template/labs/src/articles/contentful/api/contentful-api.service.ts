import { Observable } from 'rxjs';

export const ContentfulToken = 'oryx.ContentfulSpace';
export const ContentfulSpace = 'oryx.ContentfulToken';
export const ContentfulApiService = 'oryx.ContentfulApiService';

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

export interface ContentfulResponse {
  items: {
    sys: {
      contentType: { sys: { id: string } };
    };
    fields: Record<string, string>;
  }[];
}

export interface ContentfulApiService {
  getEntries(search: ContentfulSearch): Observable<ContentfulResponse>;
}

declare global {
  interface InjectionTokensContractMap {
    [ContentfulApiService]: ContentfulApiService;
  }
}
