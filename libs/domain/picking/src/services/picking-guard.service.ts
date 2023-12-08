import { Observable } from 'rxjs';

export interface PickingGuardService {
  guard(): void;
  isProtected(): Observable<boolean>;
  allow(): void;
}

export const PickingGuardService = 'oryx.PickingGuardService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingGuardService]: PickingGuardService;
  }
}
