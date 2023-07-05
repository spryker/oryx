import { Observable } from 'rxjs';

export const ContentfulToken = 'oryx.ContentfulSpace';
export const ContentfulSpace = 'oryx.ContentfulToken';
export const ContentfulClientService = 'oryx.ContentfulClientService';

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

export interface ContentfulClientService {
  searchEntries(search: ContentfulSearch): Observable<ContentfulResponse>;
}

declare global {
  interface InjectionTokensContractMap {
    [ContentfulClientService]: ContentfulClientService;
  }
}
