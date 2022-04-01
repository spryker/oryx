import { Observable } from 'rxjs';
import { Services } from '../services';

export const enum RouterEventType {
  NavigationEnd,
}

export interface RouterEvent {
  type: RouterEventType;
  route: string;
}

export interface RouterContract {
  go(route: string): void;
  getEvents(type: RouterEventType): Observable<RouterEvent>;
}

declare global {
  interface InjectionTokensContractMap {
    [Services.Router]: RouterContract;
  }
}
