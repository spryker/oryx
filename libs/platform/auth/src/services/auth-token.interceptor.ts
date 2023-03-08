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
    if (!this.shouldInterceptRequest(url)) {
      return handle(url, options);
    }

    return this.authTokenService.getToken().pipe(
      take(1),
      map((token) => this.addBearerAuthHeader(token, options)),
      catchError(() => of(options)),
      switchMap((options) => handle(url, options))
    );
  }

  protected shouldInterceptRequest(url: string): boolean {
    return !this.config?.baseUrl || url.startsWith(this.config.baseUrl);
  }

  protected addBearerAuthHeader(
    token: AuthTokenData,
    options: Readonly<RequestOptions>
  ): RequestOptions {
    if (token.type.toLowerCase() !== 'bearer') {
      return options;
    }

    options = {
      ...options,
      headers: {
        ...options.headers,
        [this.headerName]: `Bearer ${token.token}`,
      } as HeadersInit,
    };

    return options;
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
