import { Observable } from 'rxjs';
import { AuthIdentity } from '../models';

export interface IdentityOptions {
  requireGuest?: boolean;
}

export interface IdentityService {
  /**
   * Get current user ID if available
   */
  get(options?: IdentityOptions): Observable<AuthIdentity>;
}

export const IdentityService = 'oryx.IdentityService';

declare global {
  interface InjectionTokensContractMap {
    [IdentityService]: IdentityService;
  }
}
