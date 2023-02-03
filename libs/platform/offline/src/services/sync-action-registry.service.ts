import { Observable } from 'rxjs';
import { Sync, SyncAction, SyncActionHandler } from '../models';

export interface SyncActionRegistryService {
  register<TAction extends SyncAction>(
    action: TAction,
    handler: SyncActionHandler<TAction>
  ): void;
  handleSync(sync: Sync): Observable<void>;
}

export const SyncActionRegistryService = 'oryx.SyncActionRegistryService';

declare global {
  export interface InjectionTokensContractMap {
    [SyncActionRegistryService]: SyncActionRegistryService;
  }
}
