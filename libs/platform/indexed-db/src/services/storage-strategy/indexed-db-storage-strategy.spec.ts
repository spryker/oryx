import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { IndexedDbStorageStrategyToken } from './indexed-db-storage-method';
import { IndexedDbStorageStrategy } from './indexed-db-storage-strategy';

const indexedDbTableName = 'oryx.storage';

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
  let service: IndexedDbStorageStrategy;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: IndexedDbStorageStrategyToken,
          useClass: IndexedDbStorageStrategy,
        },
      ],
    });

    service = getInjector().inject(IndexedDbStorageStrategyToken);
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
      mockDexieMethods.table.put = vi.fn().mockReturnValue(of({}));
    });

    it('should store the value to the db', () => {
      new Promise<void>((done) => {
        service.setItem('mockedKey', 'mockedValue').subscribe(() => {
          expect(mockDexieMethods.table.put).toHaveBeenCalledWith({
            key: 'mockedKey',
            value: 'mockedValue',
          });
          done();
        });
      });
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      mockDexieMethods.table.delete = vi.fn().mockReturnValue(of({}));
    });

    it('should remove the item', () => {
      new Promise<void>((done) => {
        service.removeItem('mockedKey').subscribe(() => {
          expect(mockDexieMethods.table.delete).toHaveBeenCalledWith(
            'mockedKey'
          );
          done();
        });
      });
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      mockDexieMethods.table.clear = vi.fn().mockReturnValue(of({}));
    });

    it('should remove the item', () => {
      new Promise<void>((done) => {
        service.clear().subscribe(() => {
          expect(mockDexieMethods.table.clear).toHaveBeenCalledWith();
          done();
        });
      });
    });
  });
});
