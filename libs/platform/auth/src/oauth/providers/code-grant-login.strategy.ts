import { AuthLoginStrategy, LoginRequest } from '@spryker-oryx/auth/login';
import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { EMPTY, Observable, switchMap } from 'rxjs';

export class CodeGrantAuthLoginStrategy implements AuthLoginStrategy {
  constructor(
    protected readonly config = inject(CodeGrantAuthLoginStrategyConfig),
    protected readonly http = inject(HttpService)
  ) {}

  login(request: LoginRequest): Observable<never> {
    const body = this.getUrlParams();

    body.set('username', request.email);
    body.set('password', request.password);

    return this.http
      .request<CodeGrantAuthLoginResponse[]>(this.config.loginUrl, {
        method: this.config.loginMethod ?? 'POST',
        credentials: 'omit',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(switchMap((response) => this.redirectWith(response[0])));
  }

  protected getUrlParams(): URLSearchParams {
    return new URL(globalThis.location.href).searchParams;
  }

  protected redirectWith(
    response: CodeGrantAuthLoginResponse
  ): Observable<never> {
    if (!response.code) throw new Error('Missing code in response!');

    const redirectUri = this.getUrlParams().get('redirect_uri');

    if (!redirectUri) throw new Error('Missing redirect_uri in URL params!');

    const redirectUrl = new URL(redirectUri);

    for (const [key, value] of Object.entries(response))
      redirectUrl.searchParams.set(key, value);

    globalThis.location.href = redirectUrl.toString();

    return EMPTY;
  }
}

export interface CodeGrantAuthLoginResponse extends Record<string, string> {
  code: string;
}

export interface CodeGrantAuthLoginStrategyConfig {
  loginUrl: string;
  loginMethod?: string;
}

export const CodeGrantAuthLoginStrategyConfig =
  'oryx.CodeGrantAuthLoginStrategyConfig';

declare global {
  interface InjectionTokensContractMap {
    [CodeGrantAuthLoginStrategyConfig]: CodeGrantAuthLoginStrategyConfig;
  }
}
