import {
  RouteParams,
  RouterEvent,
  RouterEventType,
  RouterService,
} from '@spryker-oryx/experience';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export class StorefrontRouterService implements RouterService {
  private router$ = new BehaviorSubject('');
  private params$ = new ReplaySubject<RouteParams>(1);
  private routerEvents$: Subject<RouterEvent> = new Subject();

  go(route: string): void {
    this.router$.next(route);
    this.routerEvents$.next({ route, type: RouterEventType.NavigationEnd });
  }

  getEvents(type: RouterEventType): Observable<RouterEvent> {
    return this.routerEvents$.pipe(filter((event) => event.type === type));
  }

  currentRoute(): Observable<string> {
    return this.router$;
  }

  currentParams(): Observable<RouteParams> {
    return this.params$;
  }

  acceptParams(params: RouteParams): void {
    this.params$.next(params);
  }
}
