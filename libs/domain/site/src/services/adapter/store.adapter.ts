import { Observable } from 'rxjs';
import { Store } from '../../models';

export interface StoreAdapter {
  get: () => Observable<Store[]>;
}

export const StoreAdapter = 'oryx.StoreAdapter';

declare global {
  interface InjectionTokensContractMap {
    [StoreAdapter]: StoreAdapter;
  }
}
