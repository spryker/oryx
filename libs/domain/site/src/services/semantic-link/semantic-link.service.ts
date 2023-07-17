import { RouteLinkType } from '@spryker-oryx/router/lit';
import { Observable } from 'rxjs';

export interface SemanticLink {
  type: RouteLinkType;
  id?: string;
  params?: Record<string, string>;
}

export interface SemanticLinkService {
  get(link: SemanticLink): Observable<string | undefined>;
}

export const SemanticLinkService = 'oryx.SemanticLinkService';

declare global {
  interface InjectionTokensContractMap {
    [SemanticLinkService]: SemanticLinkService;
  }
}
