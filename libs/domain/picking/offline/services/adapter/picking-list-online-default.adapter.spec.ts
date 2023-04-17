import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { PickingHttpService } from '@spryker-oryx/picking';
import { PickingListEntity } from '@spryker-oryx/picking/offline';
import { nextTick } from '@spryker-oryx/utilities';
import { Table } from 'dexie';
import { of } from 'rxjs';
import { PickingListOnlineDefaultAdapter } from './picking-list-online-default.adapter';
import { PickingListOnlineAdapter } from './picking-list-online.adapter';

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi.fn().mockImplementation(() => of(mockTable));
}

class MockTable implements Partial<Table> {
  bulkGet = vi.fn().mockReturnValue(new Promise((resolve) => resolve([])));
}

const mockTable = new MockTable();

describe('PickingListOnlineAdapter', () => {
  let adapter: PickingListOnlineAdapter;
  let indexeddb: MockIndexedDbService;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListOnlineAdapter,
          useClass: PickingListOnlineDefaultAdapter,
        },
        {
          provide: IndexedDbService,
          useClass: MockIndexedDbService,
        },
        {
          provide: PickingHttpService,
          useClass: HttpTestService,
        },
      ],
    });
    adapter = testInjector.inject(PickingListOnlineAdapter);
    indexeddb = testInjector.inject(
      IndexedDbService
    ) as unknown as MockIndexedDbService;
    http = testInjector.inject(
      PickingHttpService
    ) as unknown as HttpTestService;

    http.flush({ data: [], included: [], links: { self: 'mocklink' } });
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(PickingListOnlineDefaultAdapter);
  });

  describe('when get is called', () => {
    it('should parse picking lists', async () => {
      const callback = vi.fn();
      adapter.get({}).subscribe(callback);

      await nextTick(8);

      expect(callback).toHaveBeenCalled();
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(mockTable.bulkGet).toHaveBeenCalledWith([]);
    });
  });
});
