import { SyncAction, SyncPayload } from './sync.model';

export interface SyncOperation<TAction extends SyncAction = SyncAction> {
  action: TAction;
  payload: SyncPayload<TAction>;
  prevSyncIds?: string[];
}
