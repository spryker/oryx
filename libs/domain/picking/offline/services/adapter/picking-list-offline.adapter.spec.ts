import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import { PickingListAdapter, PickingListStatus } from '@spryker-oryx/picking';
import {
  PickingListEntity,
  PickingProductEntity,
} from '@spryker-oryx/picking/offline';
import { mockPickingListData } from '@spryker-oryx/picking/src/mocks';
import { nextTick } from '@spryker-oryx/utilities';
import { Collection, Table } from 'dexie';
import { of } from 'rxjs';
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

class MockCollection implements Partial<Collection> {
  toArray = vi.fn().mockReturnValue([]);
}

const mockCollection = new MockCollection();

class MockDb implements Partial<OryxDexieDb> {
  transaction = vi.fn().mockImplementation((mode, tables, fn) => fn());
}

const mockContent = { items: [] };

class MockTable implements Partial<Table> {
  get = vi.fn().mockReturnValue(mockContent);
  where = vi.fn().mockReturnValue(mockContent);
  equals = vi.fn().mockReturnValue(mockContent);
  toCollection = vi.fn().mockReturnValue(mockCollection);
  bulkGet = vi.fn().mockReturnValue(mockContent);
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
    it('should return deserialized picking list', async () => {
      const callback = vi.fn();
      adapter.get({}).subscribe(callback);

      await nextTick(8);

      expect(callback).toHaveBeenCalled();
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
      expect(mockDb.transaction).toHaveBeenCalled();
    });

    describe('and qualifier has an id', () => {
      it('should get picking list store by id', () => {
        adapter.get({ id: 'mockid' }).subscribe();

        expect(mockTable.get).toHaveBeenCalledWith('mockid');
      });
    });
  });

  describe('when startPicking is called', () => {
    it('should return picking list entity', async () => {
      const callback = vi.fn();
      adapter.startPicking(mockPickingListData[0]).subscribe(callback);

      await nextTick(7);

      expect(callback).toHaveBeenCalled();
      expect(indexeddb.getDb).toHaveBeenCalled();
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(onlineAdapter.startPicking).toHaveBeenCalledWith(
        mockPickingListData[0]
      );
      expect(mockTable.update).toHaveBeenCalledWith(mockPickingListData[0].id, {
        status: 'mock',
        localStatus: 'mock',
      });
    });
  });

  describe('when updatePickingItems is called', () => {
    it('should return picking list entity', async () => {
      const callback = vi.fn();
      adapter.updatePickingItems(mockPickingListData[0]).subscribe(callback);

      await nextTick(7);

      expect(callback).toHaveBeenCalled();
      expect(indexeddb.getDb).toHaveBeenCalled();
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockTable.update).toHaveBeenCalledWith(mockPickingListData[0].id, {
        items: mockPickingListData[0].items,
      });
      expect(mockTable.get).toHaveBeenCalledWith(mockPickingListData[0].id);
    });
  });

  describe('when finishPicking is called', () => {
    it('should return picking list entity', async () => {
      const callback = vi.fn();
      adapter.finishPicking(mockPickingListData[0]).subscribe(callback);

      await nextTick(7);

      expect(callback).toHaveBeenCalled();
      expect(indexeddb.getDb).toHaveBeenCalled();
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingProductEntity);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockTable.update).toHaveBeenCalledWith(mockPickingListData[0].id, {
        localStatus: PickingListStatus.PickingFinished,
      });
      expect(mockTable.get).toHaveBeenCalledWith(mockPickingListData[0].id);
      expect(syncScheduler.schedule).toHaveBeenCalled();
    });
  });
});
