import { Observable } from 'rxjs';

export interface SemanticLink {
  type: SemanticLinkType;
  id: string;
}

export const enum SemanticLinkType {
  ProductList = 'plp',
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
