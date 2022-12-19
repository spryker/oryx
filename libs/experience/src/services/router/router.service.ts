import { Observable } from 'rxjs';

export const RouterService = 'FES.RouterService';

export const enum RouterEventType {
  NavigationEnd,
}

export interface RouterEvent {
  type: RouterEventType;
  route: string;
}

export interface NavigationExtras {
  queryParams?: RouteParams;
  queryParamsHandling?: QueryParamsHandling;
}

export interface RouteParams {
  [key: string]: string | string[] | undefined;
}

export type QueryParamsHandling = 'merge' | '';

export interface RouterService {
  go(route: string, extras?: NavigationExtras): void;
  back(): void;
  previousRoute(): Observable<string | null>;
  navigate(route: string): void;
  getEvents(type: RouterEventType): Observable<RouterEvent>;
  currentRoute(): Observable<string>;
  currentParams(): Observable<RouteParams>;
  currentQuery(): Observable<RouteParams | undefined>;
  acceptParams(params: RouteParams): void;
  getUrl(route?: string, extras?: NavigationExtras): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [RouterService]: RouterService;
  }
}
