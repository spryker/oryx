import { RouteConfig } from '@spryker-oryx/router/lit';
import { Observable } from 'rxjs';

export interface RouterService {
  go(route: string, extras?: NavigationExtras): void;
  back(): void;
  previousRoute(): Observable<string | null>;
  navigate(route: string): void;
  getEvents(type: RouterEventType): Observable<RouterEvent>;
  route(): Observable<string>;
  currentRoute(): Observable<string>;
  currentRouteWithParams(): Observable<RouteWithParams>;
  setCurrentRouteConfig(config: RouteConfig): void;
  currentParams(): Observable<RouteParams>;
  currentQuery(): Observable<RouteParams | undefined>;
  acceptParams(params: RouteParams): void;
  getUrl(route?: string, extras?: NavigationExtras): Observable<string>;
  getPathId(id: string): string | undefined;
  setRoutes(routes: RouteConfig[]): void;
  getRoutes(): Observable<RouteConfig[] | undefined>;
}

export const RouterService = 'oryx.RouterService';

declare global {
  interface InjectionTokensContractMap {
    [RouterService]: RouterService;
  }
}

export const enum RouterEventType {
  NavigationEnd,
}

export const enum RouteType {
  Page = 'page',
  ProductList = 'search',
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

export interface RouterEvent {
  type: RouterEventType;
  route: string;
}

export interface NavigationExtras {
  queryParams?: RouteParams;
  queryParamsHandling?: QueryParamsHandling;
  ignoreQueryParams?: string[];
}

export interface RouteParams {
  [key: string]: string | string[] | undefined;
}

export type QueryParamsHandling = 'merge' | '';

export type RouteWithParams = RouteConfig & {
  params: RouteParams;
  query: RouteParams;
};
