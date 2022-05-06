import { Observable } from 'rxjs';

export const RouterService = 'FES.RouterService';

export const enum RouterEventType {
  NavigationEnd,
}

export interface RouterEvent {
  type: RouterEventType;
  route: string;
}

export interface RouterService {
  go(route: string): void;
  getEvents(type: RouterEventType): Observable<RouterEvent>;
}

declare global {
  interface InjectionTokensContractMap {
    [RouterService]: RouterService;
  }
}
