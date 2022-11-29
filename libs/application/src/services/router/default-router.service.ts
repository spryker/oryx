import { StorageService, StorageType } from '@spryker-oryx/core';
import {
  NavigationExtras,
  RouteParams,
  RouterEvent,
  RouterEventType,
  RouterService,
} from '@spryker-oryx/experience';
import { inject } from '@spryker-oryx/injector';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
  Subject,
  withLatestFrom,
} from 'rxjs';
import { filter } from 'rxjs/operators';

const CURRENT_PAGE = 'currentPage';
const PREVIOUS_PAGE = 'previousPage';

export class DefaultRouterService implements RouterService {
  private router$ = new BehaviorSubject(window.location.pathname);
  private params$ = new ReplaySubject<RouteParams>(1);
  private urlSearchParams$ = new BehaviorSubject<RouteParams>(
    this.getURLSearchParams()
  );
  private routerEvents$: Subject<RouterEvent> = new Subject();
  private storedRoute$ = new BehaviorSubject('');

  protected storageService = inject(StorageService);

  go(route: string, extras?: NavigationExtras): void {
    if (
      this.router$.value === route &&
      JSON.stringify(this.urlSearchParams$.value) ===
        JSON.stringify(extras?.queryParams ?? {})
    ) {
      return;
    }

    this.router$.next(route);
    this.urlSearchParams$.next(
      extras?.queryParams ?? this.getURLSearchParams() ?? {}
    );
    this.routerEvents$.next({ route, type: RouterEventType.NavigationEnd });
  }

  navigate(route: string): void {
    window.history.pushState({}, '', route);
    this.go(route);
  }

  back(): void {
    window.history.back();
  }

  getEvents(type: RouterEventType): Observable<RouterEvent> {
    return this.routerEvents$.pipe(filter((event) => event.type === type));
  }

  previousRoute(): Observable<string | null> {
    return this.storageService.get<string>(PREVIOUS_PAGE, StorageType.SESSION);
  }

  currentRoute(): Observable<string> {
    return this.router$.pipe(
      withLatestFrom(this.storedRoute$),
      map(([route, currentPage]) => {
        if (currentPage) {
          this.storageService.set(
            PREVIOUS_PAGE,
            currentPage,
            StorageType.SESSION
          );
        }
        this.storeRoute(route);
        return route;
      })
    );
  }

  currentParams(): Observable<RouteParams> {
    return this.params$;
  }

  acceptParams(params: RouteParams): void {
    this.params$.next(params);
  }

  currentQuery(): Observable<RouteParams | undefined> {
    return this.urlSearchParams$.asObservable();
  }

  getUrl(route?: string, extras?: NavigationExtras): string {
    const queryParams = this.createUrlParams(extras?.queryParams);
    return `${route}${queryParams ? `?${queryParams}` : ''}`;
  }

  activatedRouter() {
    return combineLatest([this.currentRoute(), this.currentQuery()]).pipe(
      map(([route, queryParams]) => {
        return {
          route,
          extras: {
            queryParams,
          },
        };
      })
    );
  }

  protected createUrlParams(params?: {
    [x: string]: string | undefined;
  }): URLSearchParams | undefined {
    if (!params) {
      return;
    }

    const encodedParams = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, encodeURIComponent(v ?? '')])
    );

    return new URLSearchParams(encodedParams);
  }

  protected storeRoute(value: string): void {
    this.storageService.set(CURRENT_PAGE, value, StorageType.SESSION);
    this.storedRoute$.next(value);
  }

  protected getURLSearchParams(): { [k: string]: string } {
    return Object.fromEntries(
      new URLSearchParams(decodeURIComponent(window.location?.search)).entries()
    );
  }
}
