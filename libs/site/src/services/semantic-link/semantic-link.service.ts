import { Observable } from 'rxjs';

export interface SemanticLink {
  type: SemanticLinkType;
  id?: string;
  params?: Record<string, string>;
}

export const enum SemanticLinkType {
  ProductList = 'search',
  Page = 'page',
  Product = 'product',
  Category = 'category',
}

export interface SemanticLinkService {
  get(link: SemanticLink): Observable<string | undefined>;
}

export const SemanticLinkService = 'FES.SemanticLinkService';

declare global {
  interface InjectionTokensContractMap {
    [SemanticLinkService]: SemanticLinkService;
  }
}
