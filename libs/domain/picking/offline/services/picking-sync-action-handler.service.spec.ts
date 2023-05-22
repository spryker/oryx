import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { Sync, SyncStatus } from '@spryker-oryx/offline';
import { PickingListStatus } from '@spryker-oryx/picking';
import {
  PickingListEntity,
  PickingSyncAction,
} from '@spryker-oryx/picking/offline';
import { Table } from 'dexie';
import { of } from 'rxjs';
import { PickingListOnlineAdapter } from './adapter';
import { PickingSyncActionHandlerService } from './picking-sync-action-handler.service';

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi.fn().mockImplementation(() => of(mockTable));
}

class MockPickingListOnlineAdapter
  implements Partial<PickingListOnlineAdapter>
{
  get = vi.fn().mockReturnValue(of([]));
  finishPicking = vi.fn().mockReturnValue(of([]));
}

const mockContent = { items: [] };

class MockTable implements Partial<Table> {
  bulkPut = vi.fn().mockReturnValue([]);
  update = vi.fn().mockReturnValue(mockContent);
}

const mockTable = new MockTable();

const mockSync = {
  action: PickingSyncAction.FinishPicking,
  id: 123,
  prevSyncIds: [],
  status: SyncStatus.Processing,
  payload: {
    id: 'mock',
    status: PickingListStatus.ReadyForPicking,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
    itemsCount: 0,
    orderReferences: [],
    productSkus: [],
    requestedDeliveryDate: new Date(),
    localStatus: PickingListStatus.ReadyForPicking,
  },
  scheduledAt: new Date(),
  retries: 0,
  errors: [],
  whenCompleted: vi.fn(),
  cancel: vi.fn(),
};

describe('PickingSyncActionHandlerService', () => {
  let service: PickingSyncActionHandlerService;
  let indexeddb: MockIndexedDbService;
  let adapter: MockPickingListOnlineAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingSyncActionHandlerService,
          useClass: PickingSyncActionHandlerService,
        },
        {
          provide: IndexedDbService,
          useClass: MockIndexedDbService,
        },
        {
          provide: PickingListOnlineAdapter,
          useClass: MockPickingListOnlineAdapter,
        },
      ],
    });

    service = testInjector.inject(PickingSyncActionHandlerService);
    indexeddb = testInjector.inject(
      IndexedDbService
    ) as unknown as MockIndexedDbService;
    adapter = testInjector.inject(
      PickingListOnlineAdapter
    ) as unknown as MockPickingListOnlineAdapter;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(PickingSyncActionHandlerService);
  });

  describe('when finishPicking action is handled', () => {
    const callback = vi.fn();
    beforeEach(() => {
      service.handleSync(mockSync).subscribe(callback);
    });
    it('should call online adapter', () => {
      expect(callback).toHaveBeenCalled();
      expect(adapter.finishPicking).toHaveBeenCalledWith(mockSync.payload);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(mockTable.update).toHaveBeenCalledWith(mockSync.payload.id, []);
    });

    describe('and store is not updated', () => {
      const callback = vi.fn();
      beforeEach(() => {
        mockTable.update.mockReturnValue(0);

        service.handleSync(mockSync).subscribe({ error: callback });
      });

      it('should throw error', () => {
        expect(callback).toHaveBeenCalledWith(
          new Error(
            `PickingSyncActionHandlerService: Could not update PickingList(mock) after finishing picking!`
          )
        );
      });
    });
  });

  describe('when Push action is handled', () => {
    const mockPickingLists = [{ id: 'id1' }, { id: 'id2' }];

    const mockSyncPush: Sync<PickingSyncAction.Push> = {
      ...mockSync,
      action: PickingSyncAction.Push,
      payload: {
        action: 'create',
        entity: 'picking-lists',
        ids: [mockPickingLists[0].id],
      },
    };

    const callback = vi.fn();

    beforeEach(() => {
      adapter.get.mockReturnValue(of(mockPickingLists));
      mockTable.bulkPut.mockReturnValue(mockSyncPush.payload.ids);
      service.handleSync(mockSyncPush).subscribe(callback);
    });

    it('should call online adapter and update indexedDB', () => {
      expect(adapter.get).toHaveBeenCalledWith({
        ids: mockSyncPush.payload.ids,
      });
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(mockTable.bulkPut).toHaveBeenCalledWith([mockPickingLists[0]], {
        allKeys: true,
      });
    });

    describe('and store is not updated properly', () => {
      beforeEach(() => {
        mockTable.bulkPut.mockReturnValue([]);
        service.handleSync(mockSyncPush).subscribe({ error: callback });
      });

      it('should throw error', () => {
        expect(callback).toHaveBeenCalledWith(
          new Error(
            `PickingSyncActionHandlerService: Could not add or update all PickingLists after push!`
          )
        );
      });
    });
  });
});
