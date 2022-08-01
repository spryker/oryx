import { Observable } from 'rxjs';
import { AccessToken } from './model';

export const AuthService = 'FES.AuthService';

export interface AuthService {
  login(
    username: string,
    password: string,
    remember: boolean
  ): Observable<boolean>;
  logout(): Observable<null>;
  getToken(): Observable<AccessToken | null>;
  isAuthenticated(): Observable<boolean>;
}

declare global {
  interface InjectionTokensContractMap {
    [AuthService]: AuthService;
  }
}
