import { of } from 'rxjs';
import { SyncStatus } from '../../../sync';

export const mockSync = {
  action: 'mock',
  id: 123,
  prevSyncIds: [],
  status: SyncStatus.Processing,
  payload: {},
  scheduledAt: new Date(),
  retries: 0,
  errors: [],
  whenCompleted() {
    return;
  },
  cancel() {
    return;
  },
  handleSync() {
    return of(undefined);
  },
  isSyncing() {
    return of(false);
  },
};
