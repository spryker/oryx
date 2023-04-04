import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { AuthTokenData, AuthTokenService } from './auth-token.service';

export class AuthTokenInterceptor implements HttpInterceptor {
  protected headerName = this.config?.headerName ?? 'Authorization';

  constructor(
    protected readonly config = inject(AuthTokenInterceptorConfig, null),
    protected readonly authTokenService = inject(AuthTokenService)
  ) {}

  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    return this.authTokenService.getToken().pipe(
      take(1),
      map((token) => this.addBearerAuthHeader(token, options)),
      catchError(() => of(options)),
      switchMap((options) => handle(url, options))
    );
  }

  shouldInterceptRequest(url: string): boolean {
    return !this.config?.baseUrl || url.startsWith(this.config.baseUrl);
  }

  protected addBearerAuthHeader(
    token: AuthTokenData,
    options: Readonly<RequestOptions>
  ): RequestOptions {
    if (token.type.toLowerCase() !== 'bearer') {
      return options;
    }

    const headers = new Headers(options.headers);

    headers.set(this.headerName, `Bearer ${token.token}`);

    return { ...options, headers };
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
