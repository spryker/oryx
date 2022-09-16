import { Observable } from 'rxjs';
import { AuthenticateQualifier } from './adapter';

export const AuthService = 'FES.AuthService';

export interface AuthService {
  login(qualifier: AuthenticateQualifier): Observable<boolean>;
  logout(): Observable<unknown>;
  isAuthenticated(): Observable<boolean>;
}

declare global {
  interface InjectionTokensContractMap {
    [AuthService]: AuthService;
  }
}
