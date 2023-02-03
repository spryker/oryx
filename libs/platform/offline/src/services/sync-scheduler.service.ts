import { Observable } from 'rxjs';
import { Sync, SyncAction, SyncOperation } from '../models';

export interface SyncSchedulerService {
  schedule<TAction extends SyncAction>(
    operation: SyncOperation<TAction>
  ): Observable<Sync<TAction>>;
  findSync(syncId: number): Observable<Sync>;
  getPending(): Observable<Sync[]>;
  hasPending(): Observable<boolean>;
  getFailed(): Observable<Sync[]>;
  hasFailed(): Observable<boolean>;
}

export const SyncSchedulerService = 'oryx.SyncSchedulerService';

declare global {
  export interface InjectionTokensContractMap {
    [SyncSchedulerService]: SyncSchedulerService;
  }
}
