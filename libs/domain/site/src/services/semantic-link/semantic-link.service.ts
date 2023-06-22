import { Observable } from 'rxjs';

export interface SemanticLink {
  type: SemanticLinkType;
  id?: string;
  params?: Record<string, string>;
}

export enum SemanticLinkType {
  Article = 'article',
  ProductList = 'search',
  Page = 'page',
  Product = 'product',
  Category = 'category',
  Checkout = 'checkout',
  CheckoutLogin = 'checkoutLogin',
  Order = 'order',
  Cart = 'cart',
  Login = 'login',
  AddressList = 'address-list',
  AddressBookCreate = 'address-book-create',
  AddressBookEdit = 'address-book-edit',
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
