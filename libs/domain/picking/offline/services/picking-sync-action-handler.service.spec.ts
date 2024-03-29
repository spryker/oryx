import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { Sync, SyncStatus } from '@spryker-oryx/offline/sync';
import { PickingListStatus } from '@spryker-oryx/picking/services';
import { Table } from 'dexie';
import { of } from 'rxjs';
import { PickingListEntity } from '../entities';
import { PickingListOnlineAdapter } from './adapter';
import {
  PickingSyncAction,
  PickingSyncActionHandlerService,
} from './picking-sync-action-handler.service';

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi
    .fn()
    .mockImplementation((entityType) =>
      of(
        entityType === PickingListEntity
          ? mockPickingListsTable
          : mockProductsTable
      )
    );
}

class MockPickingListOnlineAdapter
  implements Partial<PickingListOnlineAdapter>
{
  get = vi
    .fn()
    .mockReturnValue(of([{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }]));
  finishPicking = vi.fn().mockReturnValue(of([]));
}

const mockContent = { items: [] };

class MockTable implements Partial<Table> {
  bulkPut = vi.fn().mockReturnValue([]);
  update = vi.fn().mockReturnValue(mockContent);
  bulkDelete = vi.fn();
  where = vi.fn().mockReturnValue({
    anyOf: vi.fn().mockReturnValue({
      count: vi.fn().mockResolvedValue(0),
    }),
  });
}

const mockPickingListsTable = new MockTable();
const mockProductsTable = new MockTable();

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

  const callback = vi.fn();

  describe('when handleSync is called with an unknown action', () => {
    const unknownSync = {
      ...mockSync,
      action: 'Unknown' as unknown as PickingSyncAction,
    };

    beforeEach(() => {
      service.handleSync(unknownSync).subscribe({ error: callback });
    });

    it('should throw error', () => {
      expect(callback).toHaveBeenCalledWith(
        new Error(
          `PickingSyncActionHandlerService: Unable to handle unknown sync action '${unknownSync.action}'!`
        )
      );
    });
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
      expect(mockPickingListsTable.update).toHaveBeenCalledWith(
        mockSync.payload.id,
        []
      );
    });

    describe('and store is not updated', () => {
      const callback = vi.fn();
      beforeEach(() => {
        mockPickingListsTable.update.mockReturnValue(0);

        service.handleSync(mockSync).subscribe({ error: callback });
      });

      it('should throw error', () => {
        expect(callback).toHaveBeenCalledWith(
          new Error(
            `PickingSyncActionHandlerService: Could not update PickingList(${mockSync.payload.id}) after finishing picking!`
          )
        );
      });
    });
  });

  describe('when Push action is handled', () => {
    const mockPickingLists = [
      {
        id: 'id1',
        items: [
          {
            product: {
              id: 'product-id-1',
            },
          },
          {
            product: {
              id: 'product-id-2',
            },
          },
        ],
      },
      {
        id: 'id2',
        items: [
          {
            product: {
              id: 'product-id-2',
            },
          },
          {
            product: {
              id: 'product-id-3',
            },
          },
        ],
      },
    ];

    const pickingListsIdsToRemove = ['id3'];
    const mockPickingListsIdsToCreate = mockPickingLists.map((pl) => pl.id);

    const mockSyncPush: Sync<PickingSyncAction.Push> = {
      ...mockSync,
      action: PickingSyncAction.Push,
      payload: {
        action: 'create',
        entity: 'picking-lists',
        ids: [...mockPickingListsIdsToCreate, ...pickingListsIdsToRemove],
      },
    };

    const syncCallback = vi.fn();

    beforeEach(() => {
      adapter.get.mockReturnValue(of(mockPickingLists));
      mockPickingListsTable.bulkPut.mockReturnValue(
        mockPickingListsIdsToCreate
      );
      mockPickingListsTable.where = vi.fn().mockReturnValue({
        anyOf: vi.fn().mockReturnValue({
          count: vi.fn().mockResolvedValue(pickingListsIdsToRemove.length),
        }),
      });
      service.handleSync(mockSyncPush).subscribe(callback);
      service.isSyncing().subscribe(syncCallback);
    });

    it('should call online adapter and update indexedDB', () => {
      expect(callback).toHaveBeenCalled();
      expect(adapter.get).toHaveBeenCalledWith({
        ids: mockSyncPush.payload.ids,
      });
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(mockPickingListsTable.bulkDelete).toHaveBeenCalledWith(
        pickingListsIdsToRemove
      );
      expect(mockPickingListsTable.bulkPut).toHaveBeenCalledWith(
        mockPickingLists,
        {
          allKeys: true,
        }
      );
      expect(mockProductsTable.bulkPut).toHaveBeenLastCalledWith([
        { id: 'product-id-1' },
        { id: 'product-id-2' },
        { id: 'product-id-3' },
      ]);
    });
    it('should update syncing status', () => {
      expect(syncCallback).toHaveBeenNthCalledWith(1, true);
      expect(syncCallback).toHaveBeenLastCalledWith(false);
    });
  });
});
