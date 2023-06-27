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

export type ContentfulResponse = Observable<{
  items: {
    sys: {
      contentType: { sys: { id: string } };
    };
    fields: Record<string, string>;
  }[];
}>;

export type ContentfulResult = { contentful: Record<'name', string>[] };

export interface ContentfulClientService {
  getEntries(search: ContentfulSearch): ContentfulResponse;
}

export const ContentfulClientService = 'oryx.ContentfulClientService';

declare global {
  interface InjectionTokensContractMap {
    [ContentfulClientService]: ContentfulClientService;
  }
}
