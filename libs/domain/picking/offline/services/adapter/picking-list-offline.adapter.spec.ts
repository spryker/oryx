import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import {
  PickingListAdapter,
  PickingListQualifierSortBy,
  PickingListStatus,
} from '@spryker-oryx/picking';
import { mockPickingListData } from '@spryker-oryx/picking/src/mocks';
import { nextTick } from '@spryker-oryx/utilities';
import { Collection, Table } from 'dexie';
import { of } from 'rxjs';
import { PickingListEntity, PickingProductEntity } from '../../entities';
import { PickingSyncAction } from '../picking-sync-action-handler.service';
import { PickingListOfflineAdapter } from './picking-list-offline.adapter';
import { PickingListOnlineAdapter } from './picking-list-online.adapter';

vi.mock('dexie', () => {
  const liveQuery = vi.fn().mockImplementation((fn: any) => fn());
  return { liveQuery };
});

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi.fn().mockImplementation(() => of(mockTable));
  getDb = vi.fn().mockReturnValue(of(mockDb));
}

class MockSyncSchedulerService implements Partial<SyncSchedulerService> {
  schedule = vi.fn().mockReturnValue(of(undefined));
}

class MockPickingListOnlineAdapter
  implements Partial<PickingListOnlineAdapter>
{
  startPicking = vi.fn().mockReturnValue(of({ status: 'mock' }));
}

const mockContent = { items: [] };

class MockCollection implements Partial<Collection> {
  toArray = vi.fn().mockReturnValue([]);
  equals = vi.fn().mockReturnValue(this);
  startsWithAnyOfIgnoreCase = vi.fn().mockReturnValue(this);
  distinct = vi.fn().mockReturnValue(this);
  offset = vi.fn().mockReturnValue(this);
  limit = vi.fn().mockReturnValue(this);
  reverse = vi.fn().mockReturnValue(this);
  sortBy = vi.fn().mockReturnValue([]);
}

const mockCollection = new MockCollection();

class MockDb implements Partial<OryxDexieDb> {
  transaction = vi.fn().mockImplementation((mode, tables, fn) => fn());
}

class MockTable implements Partial<Table> {
  get = vi.fn().mockReturnValue(mockContent);
  where = vi.fn().mockReturnValue(mockCollection);
  toCollection = vi.fn().mockReturnValue(mockCollection);
  bulkGet = vi.fn().mockReturnValue([mockContent]);
  update = vi.fn().mockReturnValue(mockContent);
}

const mockTable = new MockTable();
const mockDb = new MockDb();

describe('PickingListOfflineAdapter', () => {
  let adapter: PickingListAdapter;
  let indexeddb: MockIndexedDbService;
  let onlineAdapter: MockPickingListOnlineAdapter;
  let syncScheduler: MockSyncSchedulerService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListAdapter,
          useClass: PickingListOfflineAdapter,
        },
        {
          provide: IndexedDbService,
          useClass: MockIndexedDbService,
        },
        {
          provide: SyncSchedulerService,
          useClass: MockSyncSchedulerService,
        },
        {
          provide: PickingListOnlineAdapter,
          useClass: MockPickingListOnlineAdapter,
        },
      ],
    });
    adapter = testInjector.inject(PickingListAdapter);
    indexeddb = testInjector.inject(
      IndexedDbService
    ) as unknown as MockIndexedDbService;
    onlineAdapter = testInjector.inject(
      PickingListOnlineAdapter
    ) as unknown as MockPickingListOnlineAdapter;
    syncScheduler = testInjector.inject(
      SyncSchedulerService
    ) as unknown as MockSyncSchedulerService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(PickingListOfflineAdapter);
  });

  describe('when get is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      adapter.get({}).subscribe(callback);
    });
    it('should complete observable', async () => {
      await nextTick(4);
      expect(callback).toHaveBeenCalled();
    });

    it('should call indexed DB getDb', () => {
      expect(indexeddb.getDb).toHaveBeenCalled();
    });

    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
    });

    it('should call DB transaction', () => {
      expect(mockDb.transaction).toHaveBeenCalledWith(
        'readonly',
        [mockTable, mockTable],
        expect.any(Function)
      );
    });

    describe('and qualifier has an id', () => {
      it('should get picking list store by id', () => {
        adapter.get({ ids: ['mockid'] }).subscribe();

        expect(mockTable.bulkGet).toHaveBeenCalledWith(['mockid']);
      });

      describe('and store is empty', () => {
        beforeEach(() => {
          mockTable.get.mockReturnValue(undefined);
          adapter.get({ ids: ['mockid'] }).subscribe(callback);
        });

        it('should return empty array', async () => {
          await nextTick(4);

          expect(callback).toHaveBeenCalledWith([]);
        });

        afterEach(() => {
          mockTable.get.mockReturnValue(mockContent);
        });
      });
    });

    describe('and qualifier has a status', () => {
      it('should filter store', () => {
        adapter.get({ status: PickingListStatus.PickingStarted }).subscribe();

        expect(mockTable.where).toHaveBeenCalledWith('localStatus');
        expect(mockCollection.equals).toHaveBeenCalledWith(
          PickingListStatus.PickingStarted
        );
      });
    });

    describe('and qualifier has order references', () => {
      it('should filter store', () => {
        adapter.get({ searchOrderReference: 'mockOrderReference' }).subscribe();

        expect(mockTable.where).toHaveBeenCalledWith('orderReferences');
        expect(mockCollection.startsWithAnyOfIgnoreCase).toHaveBeenCalledWith(
          'mockOrderReference'
        );
        expect(mockCollection.distinct).toHaveBeenCalled();
      });
    });

    describe('and qualifier has offset', () => {
      it('should filter store', () => {
        adapter.get({ offset: 1 }).subscribe();

        expect(mockCollection.offset).toHaveBeenCalledWith(1);
      });
    });

    describe('and qualifier has limit', () => {
      it('should filter store', () => {
        adapter.get({ limit: 1 }).subscribe();

        expect(mockCollection.limit).toHaveBeenCalledWith(1);
      });
    });

    describe('and qualifier has sortDesc', () => {
      it('should filter store', () => {
        adapter.get({ sortDesc: true }).subscribe();

        expect(mockCollection.reverse).toHaveBeenCalled();
      });
    });

    describe('and qualifier has sortBy', () => {
      it('should map the qualifier and filter store', () => {
        adapter
          .get({ sortBy: PickingListQualifierSortBy.DeliveryDate })
          .subscribe();

        expect(mockCollection.sortBy).toHaveBeenCalledWith(
          'requestedDeliveryDate'
        );
      });
    });
  });

  describe('when startPicking is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      adapter.startPicking(mockPickingListData[0]).subscribe(callback);
    });
    it('should complete observable', async () => {
      await nextTick(3);

      expect(callback).toHaveBeenCalled();
    });

    it('should call indexed DB getDb', () => {
      expect(indexeddb.getDb).toHaveBeenCalled();
    });

    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
    });

    it('should call DB transaction', () => {
      expect(mockDb.transaction).toHaveBeenCalledWith(
        'readwrite',
        [mockTable, mockTable],
        expect.any(Function)
      );
    });

    it('should call online adapter startPicking', () => {
      expect(onlineAdapter.startPicking).toHaveBeenCalledWith(
        mockPickingListData[0]
      );
    });

    it('should call store update', () => {
      expect(mockTable.update).toHaveBeenCalledWith(mockPickingListData[0].id, {
        status: 'mock',
        localStatus: 'mock',
      });
    });
  });

  describe('when updatePickingItems is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      adapter.updatePickingItems(mockPickingListData[0]).subscribe(callback);
    });
    it('should complete observable', async () => {
      await nextTick(3);
      expect(callback).toHaveBeenCalled();
    });

    it('should call indexed DB getDb', () => {
      expect(indexeddb.getDb).toHaveBeenCalled();
    });

    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
    });

    it('should call DB transaction', () => {
      expect(mockDb.transaction).toHaveBeenCalledWith(
        'readwrite',
        [mockTable, mockTable],
        expect.any(Function)
      );
    });

    it('should call store', () => {
      expect(mockTable.update).toHaveBeenCalledWith(mockPickingListData[0].id, {
        items: mockPickingListData[0].items,
      });
      expect(mockTable.get).toHaveBeenCalledWith(mockPickingListData[0].id);
    });
  });

  describe('when finishPicking is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      adapter.finishPicking(mockPickingListData[0]).subscribe(callback);
    });
    it('should complete observable', async () => {
      await nextTick(3);
      expect(callback).toHaveBeenCalled();
    });

    it('should call indexed DB getDb', () => {
      expect(indexeddb.getDb).toHaveBeenCalled();
    });

    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
    });

    it('should call DB transaction', () => {
      expect(mockDb.transaction).toHaveBeenCalledWith(
        'readwrite',
        [mockTable, mockTable],
        expect.any(Function)
      );
    });

    it('should call store', () => {
      expect(mockTable.update).toHaveBeenCalledWith(mockPickingListData[0].id, {
        localStatus: PickingListStatus.PickingFinished,
      });
      expect(mockTable.get).toHaveBeenCalledWith(mockPickingListData[0].id);
    });

    it('should call SyncSchedulerService schedule', async () => {
      await nextTick(3);
      expect(syncScheduler.schedule).toHaveBeenCalledWith({
        action: PickingSyncAction.FinishPicking,
        payload: mockContent,
      });
    });
  });
});
