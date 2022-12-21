import { Observable } from 'rxjs';

export interface SemanticLink {
  type: SemanticLinkType;
  id?: string;
  params?: Record<string, string>;
}

export enum SemanticLinkType {
  ProductList = 'search',
  Page = 'page',
  Product = 'product',
  Category = 'category',
  Checkout = 'checkout',
  Cart = 'cart',
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
