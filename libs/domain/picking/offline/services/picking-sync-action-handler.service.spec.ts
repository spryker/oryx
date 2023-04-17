import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { SyncStatus } from '@spryker-oryx/offline';
import { PickingListStatus } from '@spryker-oryx/picking';
import {
  PickingListEntity,
  PickingSyncAction,
} from '@spryker-oryx/picking/offline';
import { nextTick } from '@spryker-oryx/utilities';
import { Collection, Table } from 'dexie';
import { of } from 'rxjs';
import { PickingListOnlineAdapter } from './adapter';
import { PickingSyncActionHandlerService } from './picking-sync-action-handler.service';

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi.fn().mockImplementation(() => of(mockTable));
}

class MockPickingListOnlineAdapter
  implements Partial<PickingListOnlineAdapter>
{
  finishPicking = vi.fn().mockReturnValue(of([]));
}

class MockCollection implements Partial<Collection> {
  toArray = vi.fn().mockReturnValue([]);
}

const mockCollection = new MockCollection();

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
    it('should call online adapter', async () => {
      const callback = vi.fn();

      service.handleSync(mockSync).subscribe(callback);

      await nextTick(2);

      expect(callback).toHaveBeenCalled();
      expect(adapter.finishPicking).toHaveBeenCalledWith(mockSync.payload);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(mockTable.update).toHaveBeenCalledWith(mockSync.payload.id, []);
    });
  });
});
