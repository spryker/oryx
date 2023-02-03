import { Observable } from 'rxjs';

export interface SyncExecutorService {
  processPendingSyncs(): Observable<number>;
}

export const SyncExecutorService = 'oryx.SyncExecutorService';

declare global {
  export interface InjectionTokensContractMap {
    [SyncExecutorService]: SyncExecutorService;
  }
}
