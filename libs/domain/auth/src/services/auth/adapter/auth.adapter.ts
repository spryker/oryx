import { Observable } from 'rxjs';
import { AccessToken } from '../../../models';

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

export const AuthAdapter = 'oryx.AuthAdapter';

declare global {
  interface InjectionTokensContractMap {
    [AuthAdapter]: AuthAdapter;
  }
}
