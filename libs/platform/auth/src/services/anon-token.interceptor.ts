import {
  HttpHandlerFn,
  HttpInterceptor,
  RequestOptions,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { AuthTokenData, AuthTokenService } from './auth-token.service';

export class AnonTokenInterceptor implements HttpInterceptor {
  protected headerName = this.config.headerName;

  constructor(
    protected readonly config = inject(AnonTokenInterceptorConfig),
    protected readonly authTokenService = inject(AuthTokenService)
  ) {}

  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    return this.authTokenService.getToken().pipe(
      take(1),
      map((token) => this.addAnonHeader(token, options)),
      catchError(() => of(options)),
      switchMap((options) => handle(url, options))
    );
  }

  shouldInterceptRequest(url: string): boolean {
    return !this.config.baseUrl || url.startsWith(this.config.baseUrl);
  }

  protected addAnonHeader(
    token: AuthTokenData,
    options: Readonly<RequestOptions>
  ): RequestOptions {
    if (token.type !== 'anon') {
      return options;
    }

    const headers = new Headers(options.headers);

    headers.set(this.headerName, token.token);

    return { ...options, headers };
  }
}

export interface AnonTokenInterceptorConfig {
  headerName: string;
  baseUrl?: string;
}

export const AnonTokenInterceptorConfig = 'oryx.AnonTokenInterceptorConfig';

declare global {
  interface InjectionTokensContractMap {
    [AnonTokenInterceptorConfig]: AnonTokenInterceptorConfig;
  }
}
