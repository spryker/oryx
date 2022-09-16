import { AccessToken } from '@spryker-oryx/core';
import { Observable } from 'rxjs';

export interface AuthenticateQualifier {
  username: string;
  password: string;
  remember?: boolean;
}

export interface AuthAdapter {
  authenticate(qualifier: AuthenticateQualifier): Observable<AccessToken>;
  revoke?(): Observable<unknown>;

  refresh(token: AccessToken): Observable<AccessToken>;
}

export const AuthAdapter = 'FES.AuthAdapter';

declare global {
  interface InjectionTokensContractMap {
    [AuthAdapter]: AuthAdapter;
  }
}
