import { defaultExperienceRoutes } from '@spryker-oryx/experience';
import { RouteParams, RouterService } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { Observable, ReplaySubject, of } from 'rxjs';

export class MockRouterService implements Partial<RouterService> {
  params$ = new ReplaySubject<RouteParams>(1);

  go(): void {
    //mock
  }
  back(): void {
    //mock
  }
  navigate(): void {
    //mock
  }

  route(): Observable<string> {
    return of('/');
  }

  currentRoute(): Observable<string> {
    return this.route();
  }

  isCurrentRoute(route: string): Observable<boolean> {
    return of(route === '/');
  }

  currentParams(): Observable<RouteParams> {
    return this.params$;
  }

  currentQuery(): Observable<RouteParams> {
    return this.params$;
  }

  acceptParams(params: RouteParams): void {
    this.params$.next(params);
  }

  getPathId(id: string): string | undefined {
    return undefined;
  }

  previousRoute(): Observable<string | null> {
    return of(null);
  }

  setRoutes(routes: RouteConfig[]): void {
    //
  }

  getRoutes(): Observable<RouteConfig[]> {
    return of(defaultExperienceRoutes);
  }
}
