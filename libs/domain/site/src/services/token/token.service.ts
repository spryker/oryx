import { Observable } from 'rxjs';

export interface TokenService {
  resolve(token: string): Observable<string | undefined>;
}

export const TokenService = 'oryx.TokenService';

declare global {
  interface InjectionTokensContractMap {
    [TokenService]: TokenService;
  }
}
