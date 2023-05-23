import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  catchError,
  finalize,
  Observable,
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
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    if (this.isOauthRequest(options)) {
      console.log(url);
      
      return handle(url, this.removeOauthHeader(options));
    }

    // Pause all request before refresh request finishes
    return (this.refresh$ ?? of(undefined)).pipe(
      switchMap(() => super.intercept(url, options, handle)),
      switchMap((res) => this.handleHttpError(res, url, options, handle))
    );
  }

  protected isOauthRequest(options: RequestOptions): boolean {
    return new Headers(options.headers).has(OauthTokenInterceptor.HEADER_NAME);
  }

  protected removeOauthHeader(options: RequestOptions): RequestOptions {
    const headers = new Headers(options.headers);

    headers.delete(OauthTokenInterceptor.HEADER_NAME);

    return { ...options, headers };
  }

  protected handleHttpError(
    response: Response,
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    if (response.ok || response.status !== 401) {
      return of(response);
    }

    if (!this.refresh$) {
      this.refresh$ = this.oauthService.refreshToken().pipe(
        // If refresh failed - logout completely
        catchError(() => this.oauthService.logout()),
        finalize(() => (this.refresh$ = undefined)),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
    }

    // Retry failed request
    return this.intercept(url, options, handle);
  }
}
