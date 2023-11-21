import { Observable } from 'rxjs';

export interface PickingGuardService {
  guard(): Observable<void>;
  isProtected(): Observable<boolean>;
  allow(): Observable<void>;
}

export const PickingGuardService = 'oryx.PickingGuardService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingGuardService]: PickingGuardService;
  }
}
