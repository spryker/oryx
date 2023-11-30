import { Observable } from 'rxjs';

export interface AuthTokenService {
  getToken(): Observable<AuthTokenData>;
}

export interface AuthTokenData {
  token: string | null;
  type?: string;
}

export const AuthTokenService = 'oryx.AuthTokenService';

declare global {
  interface InjectionTokensContractMap {
    [AuthTokenService]: AuthTokenService;
  }
}
