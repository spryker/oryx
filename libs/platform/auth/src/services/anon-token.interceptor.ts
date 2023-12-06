import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { AuthTokenData, AuthTokenService } from './auth-token.service';

/** deprecated since 1.4, replaced by GuestIdentityInterceptor */
export class AnonTokenInterceptor implements HttpInterceptor {
  protected headerName = this.config.headerName;

  constructor(
    protected readonly config = inject(AnonTokenInterceptorConfig),
    protected readonly authTokenService = inject(AuthTokenService)
  ) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return this.authTokenService.getToken().pipe(
      take(1),
      map((token) => this.addAnonHeader(token, req)),
      catchError(() => of(req)),
      switchMap((newReq) => handle(newReq))
    );
  }

  shouldInterceptRequest({ url }: Request): boolean {
    return !this.config.baseUrl || url.startsWith(this.config.baseUrl);
  }

  protected addAnonHeader(token: AuthTokenData, req: Request): Request {
    if (token.type !== 'anon') {
      return req;
    }

    const newReq = req.clone();
    newReq.headers.set(this.headerName, token.token!);

    return newReq;
  }
}

/** deprecated since 1.4 */
export interface AnonTokenInterceptorConfig {
  headerName: string;
  baseUrl?: string;
}

/** deprecated since 1.4 */
export const AnonTokenInterceptorConfig = 'oryx.AnonTokenInterceptorConfig';

declare global {
  interface InjectionTokensContractMap {
    [AnonTokenInterceptorConfig]: AnonTokenInterceptorConfig;
  }
}
