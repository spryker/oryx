import { Observable } from 'rxjs';

export interface AuthService {
  /**
   * Initiate a login process.
   */
  login(): Observable<void>;
  /**
   * Initiate a logout process.
   */
  logout(): Observable<void>;
  /**
   * Returns current login state.
   */
  isAuthenticated(): Observable<boolean>;
}

export const AuthService = 'oryx.AuthService';

declare global {
  interface InjectionTokensContractMap {
    [AuthService]: AuthService;
  }
}
