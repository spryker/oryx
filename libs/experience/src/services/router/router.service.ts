import { Observable } from 'rxjs';

export const RouterService = 'FES.RouterService';

export const enum RouterEventType {
  NavigationEnd,
}

export interface RouterEvent {
  type: RouterEventType;
  route: string;
}

export interface RouteParams {
  [key: string]: string | undefined;
}

export interface RouterService {
  go(route: string): void;
  getEvents(type: RouterEventType): Observable<RouterEvent>;
  currentRoute(): Observable<string>;
  currentParams(): Observable<RouteParams>;
  acceptParams(params: RouteParams): void;
}

declare global {
  interface InjectionTokensContractMap {
    [RouterService]: RouterService;
  }
}
