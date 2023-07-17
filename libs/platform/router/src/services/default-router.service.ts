import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import {
  NavigationExtras,
  RouteParams,
  RouterEvent,
  RouterEventType,
  RouterService,
} from './router.service';
import { RouteConfig } from '../../lit/lit-routes';

const CURRENT_PAGE = 'currentPage';
const PREVIOUS_PAGE = 'previousPage';

export class DefaultRouterService implements RouterService {
  private router$ = new BehaviorSubject(globalThis.location?.pathname ?? '/');
  private params$ = new ReplaySubject<RouteParams>(1);
  private urlSearchParams$ = new BehaviorSubject<RouteParams>(
    this.getURLSearchParams()
  );
  private routerEvents$ = new Subject<RouterEvent>();
  private storedRoute$ = new BehaviorSubject('');

  protected routes?: RouteConfig[];
  protected storageService = inject(StorageService);

  go(route: string, extras?: NavigationExtras): void {
    const url = route.split('?');
    const queryParams =
      extras?.queryParams ?? this.getURLSearchParams(url[1]) ?? {};

    if (
      this.router$.value === url[0] &&
      JSON.stringify(this.urlSearchParams$.value) ===
        JSON.stringify(queryParams)
    ) {
      return;
    }

    this.storageService.set(
      PREVIOUS_PAGE,
      this.router$.getValue(),
      StorageType.Session
    );
    this.router$.next(url[0]);
    this.urlSearchParams$.next(queryParams);
    this.routerEvents$.next({ route, type: RouterEventType.NavigationEnd });
    globalThis.scrollTo?.(0, 0);
  }

  navigate(route: string): void {
    globalThis.history.pushState({}, '', route);
    this.go(route);
  }

  back(): void {
    globalThis.history.back();
  }

  getEvents(type: RouterEventType): Observable<RouterEvent> {
    return this.routerEvents$.pipe(filter((event) => event.type === type));
  }

  previousRoute(): Observable<string | null> {
    return this.storageService.get<string>(PREVIOUS_PAGE, StorageType.Session);
  }

  route(): Observable<string> {
    return this.router$;
  }

  currentRoute(): Observable<string> {
    return this.router$.pipe(tap((route) => this.storeRoute(route)));
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

  getUrl(route?: string, extras?: NavigationExtras): Observable<string> {
    return combineLatest([this.currentRoute(), this.currentQuery()]).pipe(
      take(1),
      map(([activeRoute, activeQueryParams]) => {
        if (activeQueryParams && extras?.ignoreQueryParams) {
          extras.ignoreQueryParams.forEach(
            (param) => delete activeQueryParams[param]
          );
        }

        const parsedParams = this.createUrlParams(
          extras?.queryParamsHandling === 'merge'
            ? { ...activeQueryParams, ...(extras.queryParams ?? {}) }
            : extras?.queryParams
        );

        return `${(route || activeRoute).split('?')[0]}${
          parsedParams ? `?${parsedParams}` : ''
        }`;
      })
    );
  }

  getPathId(id: string): string | undefined {
    const routeTokens = location.pathname.replace(/^\/+/g, '').split('/');
    const tokenIndex = routeTokens.findIndex((token) => token === id);

    return tokenIndex !== -1 && routeTokens.length > tokenIndex + 1
      ? routeTokens[tokenIndex + 1]
      : undefined;
  }

  setRoutes(routes: RouteConfig[]): void {
    this.routes = routes;
  }

  getRoutes(): RouteConfig[] | undefined {
    return this.routes;
  }

  protected createUrlParams(params?: {
    [x: string]: string | string[] | undefined;
  }): string | undefined {
    if (!params) {
      return;
    }

    return Object.entries(params).reduce((params, [k, v]) => {
      const encodedValue = Array.isArray(v)
        ? v.map((val) => encodeURIComponent(val)).join(',')
        : encodeURIComponent(v ?? '');

      return encodedValue
        ? `${params ? `${params}&` : ''}${k}=${encodedValue}`
        : params;
    }, '');
  }

  protected storeRoute(value: string): void {
    this.storageService.set(CURRENT_PAGE, value, StorageType.Session);
    this.storedRoute$.next(value);
  }

  protected getURLSearchParams(search?: string): { [k: string]: string } {
    return Object.fromEntries(
      new URLSearchParams(
        decodeURIComponent(search ?? globalThis.location?.search ?? '')
      ).entries()
    );
  }
}
