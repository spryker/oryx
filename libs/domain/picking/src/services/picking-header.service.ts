import { Observable } from 'rxjs';

export interface PickingHeaderService {
  shouldGuardRoute(): Observable<boolean>;
  setRouteGuard(value: boolean): void;
}

export const PickingHeaderService = 'oryx.PickingHeaderService';

declare global {
  interface InjectionTokensContractMap {
    [PickingHeaderService]: PickingHeaderService;
  }
}
