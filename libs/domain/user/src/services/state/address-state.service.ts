import { Observable } from 'rxjs';
import { CrudState } from '../../models';

export interface AddressStateService {
  setAction(action: CrudState): void;
  getAction(): Observable<CrudState>;
  select(id: string | null): void;
  selected(): Observable<string | null>;
}

export const AddressStateService = 'oryx.AddressStateService';

declare global {
  interface InjectionTokensContractMap {
    [AddressStateService]: AddressStateService;
  }
}
