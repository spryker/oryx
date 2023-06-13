import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { DefaultIndexedDBStorageService } from './default-indexed-db-storage.service';
import {
  IndexedDBStorageService,
  indexedDbTableName,
} from './indexed-db-storage.service';

const mockDexieMethods = {
  open: vi.fn().mockImplementation(() => Promise.resolve),
  close: vi.fn(),
  version: {
    stores: vi.fn(),
  },
  table: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
  },
};

vi.mock('dexie', () => ({
  liveQuery: vi.fn().mockImplementation((fn: any) => fn()),
  Dexie: class {
    open = () => mockDexieMethods.open();
    table = () => mockDexieMethods.table;
    version = () => mockDexieMethods.version;
    close = () => mockDexieMethods.close();
  },
}));

describe('DefaultIndexedDBStorageService', () => {
  let service: IndexedDBStorageService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: IndexedDBStorageService,
          useClass: DefaultIndexedDBStorageService,
        },
      ],
    });

    service = getInjector().inject(IndexedDBStorageService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should open dexie db', () =>
    new Promise<void>((done) => {
      service.getItem('mockedGet').subscribe(() => {
        expect(mockDexieMethods.version.stores).toHaveBeenCalledWith({
          [indexedDbTableName]: '&key,value',
        });
        expect(mockDexieMethods.open).toHaveBeenCalled();
        done();
      });
    }));

  describe('getItem', () => {
    describe('when value is provided', () => {
      const data = { value: 'test' };
      beforeEach(() => {
        mockDexieMethods.table.get = vi
          .fn()
          .mockReturnValue(Promise.resolve(data));
      });

      it('should get the value from db', () =>
        new Promise<void>((done) => {
          service.getItem('mockedGet').subscribe((v) => {
            expect(mockDexieMethods.table.get).toHaveBeenCalledWith(
              'mockedGet'
            );
            expect(v).toBe(data.value);
            done();
          });
        }));
    });

    describe('when value is not provided', () => {
      beforeEach(() => {
        mockDexieMethods.table.get = vi
          .fn()
          .mockReturnValue(Promise.resolve({}));
      });

      it('should get the value from db', () =>
        new Promise<void>((done) => {
          service.getItem('mockedGet').subscribe((v) => {
            expect(mockDexieMethods.table.get).toHaveBeenCalledWith(
              'mockedGet'
            );
            expect(v).toBeUndefined();
            done();
          });
        }));
    });
  });

  describe('setItem', () => {
    beforeEach(() => {
      service.setItem('mockedKey', 'mockedValue');
    });

    it('should store the value to the db', () => {
      expect(mockDexieMethods.table.put).toHaveBeenCalledWith({
        key: 'mockedKey',
        value: 'mockedValue',
      });
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      service.removeItem('mockedKey');
    });

    it('should remove the item', () => {
      expect(mockDexieMethods.table.delete).toHaveBeenCalledWith('mockedKey');
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      service.clear();
    });

    it('should remove the item', () => {
      expect(mockDexieMethods.table.clear).toHaveBeenCalled();
    });
  });
});
