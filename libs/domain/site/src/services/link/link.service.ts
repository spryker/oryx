import { RouteLinkType } from '@spryker-oryx/router/lit';
import { Observable } from 'rxjs';

export interface LinkOptions {
  type: RouteLinkType | string;
  id?: string;
  params?: Record<string, string>;
}

export interface LinkService {
  get(link: LinkOptions): Observable<string | undefined>;
}

export const LinkService = 'oryx.LinkService';

declare global {
  interface InjectionTokensContractMap {
    [LinkService]: LinkService;
  }
}
