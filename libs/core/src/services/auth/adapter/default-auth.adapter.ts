import {
  AccessToken,
  HttpService,
  TransformerService,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { AuthAdapter, AuthenticateQualifier } from './auth.adapter';
import { TokenNormalizers } from './normalizers/token.normalizer';

export class DefaultAuthAdapter implements AuthAdapter {
  protected HTTP_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  constructor(
    protected http = inject(HttpService),
    protected apiUrl = inject('SCOS_BASE_URL'),
    protected transformer = inject(TransformerService)
  ) {}

  authenticate(qualifier: AuthenticateQualifier): Observable<AccessToken> {
    const { username, password } = qualifier;
    const body = `grant_type=password&username=${username}&password=${password}`;
    return this.tokenRequest({
      body: body,
    });
  }

  protected tokenRequest(options: { body: any }): Observable<AccessToken> {
    return this.http
      .request(`${this.apiUrl}/token`, {
        body: options.body,
        method: 'POST',
        headers: this.HTTP_HEADERS,
      })
      .pipe(this.transformer.do(TokenNormalizers));
  }

  refresh(token: AccessToken): Observable<AccessToken> {
    return this.tokenRequest({
      body: `grant_type=refresh_token&refresh_token=${token.refreshToken}`,
    });
  }
}
