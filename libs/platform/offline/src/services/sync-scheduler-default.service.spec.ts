import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { nextTick } from '@spryker-oryx/utilities';
import { Collection, Table } from 'dexie';
import { from, of } from 'rxjs';
import { SyncEntity } from '../entities';
import { mockSync } from '../mocks/src/mock-sync';
import { SyncStatus } from '../models';
import {
  ProcessSyncsBackgroundSyncTag,
  SyncSchedulerDefaultService,
} from './sync-scheduler-default.service';
import { SyncSchedulerService } from './sync-scheduler.service';

vi.mock('dexie', () => {
  const liveQuery = vi.fn().mockImplementation((fn: any) => from(fn()));
  return { liveQuery };
});

Object.assign(navigator, {
  serviceWorker: {
    ready: { sync: { register: vi.fn() } },
  },
});

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi.fn().mockImplementation(() => of(mockTable));
}

class MockCollection implements Partial<Collection> {
  anyOf = vi.fn().mockReturnValue(this);
  reverse = vi.fn().mockReturnValue(this);
  sortBy = vi.fn().mockReturnValue([]);
  toArray = vi.fn().mockReturnValue([]);
  count = vi.fn().mockReturnValue(0);
}

const mockCollection = new MockCollection();

class MockTable implements Partial<Table> {
  get = vi.fn().mockReturnValue(mockSync);
  where = vi.fn().mockReturnValue(mockCollection);
  update = vi.fn().mockReturnValue(mockSync);
  add = vi.fn().mockReturnValue(123);
}

const mockTable = new MockTable();

describe('SyncSchedulerDefaultService', () => {
  let service: SyncSchedulerService;
  let indexeddb: MockIndexedDbService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SyncSchedulerService,
          useClass: SyncSchedulerDefaultService,
        },
        {
          provide: IndexedDbService,
          useClass: MockIndexedDbService,
        },
      ],
    });

    service = testInjector.inject(SyncSchedulerService);
    indexeddb = testInjector.inject(
      IndexedDbService
    ) as unknown as MockIndexedDbService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(SyncSchedulerDefaultService);
  });

  describe('when findSync is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      service.findSync(123).subscribe(callback);
    });
    it('should return sync', () => {
      expect(callback).toHaveBeenCalledWith(new SyncEntity(mockSync));
    });

    it('should call store get', () => {
      expect(mockTable.get).toHaveBeenCalledWith(123);
    });
  });

  describe('when schedule is called', () => {
    const callback = vi.fn();
    const date = new Date();
    beforeEach(() => {
      vi.setSystemTime(date);
      service
        .schedule({
          action: 'mock',
          payload: '',
        })
        .subscribe(callback);
    });
    it('should return sync', async () => {
      await nextTick(2);

      expect(callback).toHaveBeenCalledWith(new SyncEntity(mockSync));
    });

    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(SyncEntity);
    });

    it('should call store', () => {
      expect(mockTable.get).toHaveBeenCalledWith(123);
      expect(mockTable.add).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'mock',
          payload: '',
          id: undefined,
          prevSyncIds: [],
          status: SyncStatus.Queued,
          retries: 0,
          scheduledAt: date,
          errors: [],
        })
      );
    });

    it('should call service worker sync', async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(
            (navigator.serviceWorker.ready as any).sync.register
          ).toHaveBeenCalledWith(ProcessSyncsBackgroundSyncTag);
          resolve();
        });
      });
    });
  });

  describe('when getPending is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      service.getPending().subscribe(callback);
    });
    it('should complete observable', () => {
      expect(callback).toHaveBeenCalled();
    });

    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(SyncEntity);
    });

    it('should call store filters', () => {
      expect(mockTable.where).toHaveBeenCalledWith('status');
      expect(mockCollection.anyOf).toHaveBeenCalledWith(
        SyncStatus.Queued,
        SyncStatus.Processing
      );
      expect(mockCollection.toArray).toHaveBeenCalled();
    });
  });

  describe('when hasPending is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      service.hasPending().subscribe(callback);
    });
    it('should call indexed db', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(SyncEntity);
    });

    it('should call store filters', () => {
      expect(mockTable.where).toHaveBeenCalledWith('status');
      expect(mockCollection.anyOf).toHaveBeenCalledWith(
        SyncStatus.Queued,
        SyncStatus.Processing
      );
      expect(mockCollection.count).toHaveBeenCalled();
    });

    describe('and there are no pending items', () => {
      it('should return false', () => {
        expect(callback).toHaveBeenCalledWith(false);
      });
    });

    describe('and there are pending items', () => {
      beforeEach(() => {
        mockCollection.count.mockReturnValue(1);
        service.hasPending().subscribe(callback);
      });
      it('should return true', () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('when getFailed is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      service.getFailed().subscribe(callback);
    });
    it('should complete observable', () => {
      expect(callback).toHaveBeenCalled();
    });

    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(SyncEntity);
    });

    it('should call store filters', () => {
      expect(mockTable.where).toHaveBeenCalledWith('[status+scheduledAt]');
      expect(mockCollection.anyOf).toHaveBeenCalledWith(SyncStatus.Failed);
      expect(mockCollection.reverse).toHaveBeenCalled();
      expect(mockCollection.sortBy).toHaveBeenCalledWith('scheduledAt');
    });
  });

  describe('when hasFailed is called', () => {
    const callback = vi.fn();
    beforeEach(() => {
      service.hasFailed().subscribe(callback);
    });
    it('should call indexed DB getStore', () => {
      expect(indexeddb.getStore).toHaveBeenCalledWith(SyncEntity);
    });

    it('should call store filters', () => {
      expect(mockTable.where).toHaveBeenCalledWith('status');
      expect(mockCollection.anyOf).toHaveBeenCalledWith(SyncStatus.Failed);
      expect(mockCollection.count).toHaveBeenCalled();
    });

    describe('and there are no failed items', () => {
      beforeEach(() => {
        mockCollection.count.mockReturnValue(0);
        service.hasFailed().subscribe(callback);
      });
      it('should return false', () => {
        expect(callback).toHaveBeenCalledWith(false);
      });
    });

    describe('and there are failed items', () => {
      beforeEach(() => {
        mockCollection.count.mockReturnValue(1);
        service.hasFailed().subscribe(callback);
      });
      it('should return true', () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });
  });
});
