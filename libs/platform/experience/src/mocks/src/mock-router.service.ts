import { RouteParams, RouterService } from '@spryker-oryx/router';
import { Observable, of, ReplaySubject } from 'rxjs';

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
}
