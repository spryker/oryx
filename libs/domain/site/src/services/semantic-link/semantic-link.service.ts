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
  CheckoutLogin = 'checkoutLogin',
  Order = 'Order',
  Cart = 'cart',
  Login = 'login',
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
