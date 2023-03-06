import { Observable } from 'rxjs';
import { LoginRequest } from './login.model';

export interface AuthLoginStrategy {
  login(request: LoginRequest): Observable<void>;
}

export const AuthLoginStrategy = 'oryx.AuthLoginStrategy';

declare global {
  interface InjectionTokensContractMap {
    [AuthLoginStrategy]: AuthLoginStrategy;
  }
}
