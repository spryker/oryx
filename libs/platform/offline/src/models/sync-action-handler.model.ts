import { Observable } from 'rxjs';
import { Sync, SyncAction } from './sync.model';

export interface SyncActionHandler<TAction extends SyncAction = SyncAction> {
  handleSync(sync: Sync<TAction>): Observable<void>;
  isSyncing(): Observable<boolean>;
}
