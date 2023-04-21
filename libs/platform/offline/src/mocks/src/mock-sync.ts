import { SyncStatus } from '@spryker-oryx/offline';
import { of } from 'rxjs';

export const mockSync = {
  action: 'mock',
  id: 123,
  prevSyncIds: [],
  status: SyncStatus.Processing,
  payload: {},
  scheduledAt: new Date(),
  retries: 0,
  errors: [],
  whenCompleted: vi.fn(),
  cancel: vi.fn(),
  handleSync: vi.fn().mockReturnValue(of(undefined)),
};
