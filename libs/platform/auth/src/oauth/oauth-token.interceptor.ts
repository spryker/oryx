import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Observable,
  catchError,
  finalize,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { AuthTokenInterceptor, AuthTokenInterceptorConfig } from '../services';
import { OauthService } from './oauth.service';

export class OauthTokenInterceptor
  extends AuthTokenInterceptor
  implements HttpInterceptor
{
  static HEADER_NAME = 'X-Oauth';

  protected refresh$?: Observable<void>;

  constructor(
    readonly config = inject(AuthTokenInterceptorConfig, null),
    protected readonly oauthService = inject(OauthService)
  ) {
    super(config, oauthService);
  }

  override intercept(
    req: Request,
    handle: HttpHandlerFn
  ): Observable<Response> {
    if (this.isOauthRequest(req)) return handle(this.removeOauthHeader(req));

    // Pause all request before refresh request finishes
    return (this.refresh$ ?? of(undefined)).pipe(
      switchMap(() => super.intercept(req, handle)),
      switchMap((res) => this.handleHttpError(res, req, handle))
    );
  }

  protected isOauthRequest(req: Request): boolean {
    return req.headers.has(OauthTokenInterceptor.HEADER_NAME);
  }

  protected removeOauthHeader(req: Request): Request {
    const newReq = req.clone();

    newReq.headers.delete(OauthTokenInterceptor.HEADER_NAME);

    return newReq;
  }

  protected handleHttpError(
    response: Response,
    req: Request,
    handle: HttpHandlerFn
  ): Observable<Response> {
    if (response.ok || response.status !== 401) return of(response);

    if (!this.refresh$) {
      this.refresh$ = this.oauthService.refreshToken().pipe(
        // If refresh failed - logout completely
        catchError(() => this.oauthService.logout()),
        finalize(() => (this.refresh$ = undefined)),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
    }

    // Retry failed request
    return this.intercept(req, handle);
  }
}
