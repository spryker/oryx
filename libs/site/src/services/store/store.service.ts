import { Observable } from 'rxjs';
import { Store } from '../../models';

export const StoreService = 'FES.StoreService';

export interface StoreService {
  getAll(): Observable<Store[]>;
  get(): Observable<Store | null>;
}

declare global {
  interface InjectionTokensContractMap {
    [StoreService]: StoreService;
  }
}
