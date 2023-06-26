import { Observable } from 'rxjs';

export interface PickingHeaderService {
  guardWithDialog(): Observable<boolean>;
  discard(): void;
  cancel(): void;
  showDialog(): Observable<boolean>;
}

export const PickingHeaderService = 'oryx.PickingHeaderService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingHeaderService]: PickingHeaderService;
  }
}
