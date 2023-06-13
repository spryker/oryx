import { Observable } from 'rxjs';

export interface RouterService {
  go(route: string, extras?: NavigationExtras): void;
  back(skip?: number): void;
  previousRoute(): Observable<string | null>;
  navigate(route: string): void;
  getEvents(type: RouterEventType): Observable<RouterEvent>;
  route(): Observable<string>;
  currentRoute(): Observable<string>;
  currentParams(): Observable<RouteParams>;
  currentQuery(): Observable<RouteParams | undefined>;
  acceptParams(params: RouteParams): void;
  getUrl(route?: string, extras?: NavigationExtras): Observable<string>;
  getPathId(id: string): string | undefined;
  shouldGuardRoute(): Observable<boolean>;
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
