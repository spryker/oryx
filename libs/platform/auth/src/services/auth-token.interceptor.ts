import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { AuthTokenData, AuthTokenService } from './auth-token.service';

export class AuthTokenInterceptor implements HttpInterceptor {
  protected headerName = this.config?.headerName ?? 'Authorization';

  constructor(
    protected readonly config = inject(AuthTokenInterceptorConfig, null),
    protected readonly authTokenService = inject(AuthTokenService)
  ) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return this.authTokenService.getToken().pipe(
      take(1),
      map((token) => this.addBearerAuthHeader(token, req)),
      catchError(() => of(req)),
      switchMap((newReq) => handle(newReq))
    );
  }

  shouldInterceptRequest({ url }: Request): boolean {
    return !this.config?.baseUrl || url.startsWith(this.config.baseUrl);
  }

  protected addBearerAuthHeader(token: AuthTokenData, req: Request): Request {
    if (token.type?.toLowerCase() !== 'bearer') {
      return req;
    }

    const newReq = req.clone();
    newReq.headers.set(this.headerName, `Bearer ${token.token}`);

    return newReq;
  }
}

export interface AuthTokenInterceptorConfig {
  baseUrl?: string;
  headerName?: string;
}

export const AuthTokenInterceptorConfig = 'oryx.AuthTokenInterceptorConfig';

declare global {
  interface InjectionTokensContractMap {
    [AuthTokenInterceptorConfig]: AuthTokenInterceptorConfig;
  }
}
