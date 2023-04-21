import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { mockSync } from '@spryker-oryx/offline/mocks';
import { nextTick } from '@spryker-oryx/utilities';
import { Table } from 'dexie';
import { of } from 'rxjs';
import { SyncStatus } from '../models';
import { SyncActionRegistryService } from './sync-action-registry.service';
import { SyncExecutorDefaultService } from './sync-executor-default.service';
import { SyncExecutorService } from './sync-executor.service';
import { SyncSchedulerService } from './sync-scheduler.service';

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi.fn().mockImplementation(() => of(mockTable));
}

class MockTable implements Partial<Table> {
  update = vi.fn().mockReturnValue(mockSync);
}

const mockTable = new MockTable();

class MockSyncSchedulerService implements Partial<SyncSchedulerService> {
  getPending = vi.fn().mockReturnValue(of([mockSync]));
}

class MockSyncActionRegistryService
  implements Partial<SyncActionRegistryService>
{
  handleSync = vi.fn().mockReturnValue(of(undefined));
}

describe('SyncExecutorDefaultService', () => {
  let service: SyncExecutorService;
  let syncScheduler: MockSyncSchedulerService;
  let syncActionRegistry: MockSyncActionRegistryService;
  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SyncExecutorService,
          useClass: SyncExecutorDefaultService,
        },
        {
          provide: IndexedDbService,
          useClass: MockIndexedDbService,
        },
        {
          provide: SyncActionRegistryService,
          useClass: MockSyncActionRegistryService,
        },
        {
          provide: SyncSchedulerService,
          useClass: MockSyncSchedulerService,
        },
      ],
    });

    service = testInjector.inject(SyncExecutorService);
    syncScheduler = testInjector.inject(
      SyncSchedulerService
    ) as unknown as MockSyncSchedulerService;
    syncActionRegistry = testInjector.inject(
      SyncActionRegistryService
    ) as unknown as MockSyncActionRegistryService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(SyncExecutorDefaultService);
  });

  describe('when processing', () => {
    const callback = vi.fn();

    it('should call SyncSchedulerService', () => {
      service.processPendingSyncs().subscribe(callback);

      expect(syncScheduler.getPending).toHaveBeenCalled();
    });

    describe('and there are no pending syncs', () => {
      beforeEach(() => {
        syncScheduler.getPending.mockReturnValue(of([]));
        service.processPendingSyncs().subscribe(callback);
      });
      it('should return 0', () => {
        expect(callback).toHaveBeenCalledWith(0);
      });
      it('should not call SyncActionRegistryService', () => {
        expect(syncActionRegistry.handleSync).not.toHaveBeenCalled();
      });
    });
    describe('and there are pending syncs', () => {
      const date = new Date();
      beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(date);
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should return 1', async () => {
        service.processPendingSyncs().subscribe(callback);

        await nextTick(8);

        expect(callback).toHaveBeenCalledWith(1);
      });

      it('should call SyncActionRegistryService', () => {
        service.processPendingSyncs().subscribe(callback);
        expect(syncActionRegistry.handleSync).toHaveBeenCalledWith(mockSync);
      });

      it('should call store update', () => {
        service.processPendingSyncs().subscribe(callback);
        expect(mockTable.update).toHaveBeenCalledWith(mockSync.id, {
          status: SyncStatus.Completed,
          completedAt: date,
          retries: 0,
        });
      });

      describe('and store fails to update', () => {
        beforeEach(() => {
          mockTable.update.mockReturnValue(0);
          service.processPendingSyncs().subscribe({ error: callback });
        });

        it('should throw error', () => {
          expect(callback).toHaveBeenCalledWith(
            new Error(
              'SyncExecutorDefaultService: Could not update failed Sync(123)!'
            )
          );
        });
      });
    });
  });
});
