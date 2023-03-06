import { Observable } from 'rxjs';
import { AuthIdentity } from '../models';

export interface IdentityService {
  /**
   * Get current user ID if available
   */
  get(): Observable<AuthIdentity>;
}

export const IdentityService = 'oryx.IdentityService';

declare global {
  interface InjectionTokensContractMap {
    [IdentityService]: IdentityService;
  }
}
