import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { lastValueFrom, of } from 'rxjs';
import { DefaultStorageService } from './default-storage.service';
import { IndexedDBStorageService } from './indexed-db-storage.service';
import { StorageType } from './model';
import { StorageService } from './storage.service';

class MockedDBservice implements Partial<IndexedDBStorageService> {
  getItem = vi.fn().mockReturnValue(of(JSON.stringify('')));
}

describe('DefaultStorageService', () => {
  let service: StorageService;
  let dbService: MockedDBservice;
  let data: any;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: StorageService,
          useClass: DefaultStorageService,
        },
        {
          provide: IndexedDBStorageService,
          useClass: MockedDBservice,
        },
      ],
    });

    service = getInjector().inject(StorageService);
    dbService = getInjector().inject(
      IndexedDBStorageService
    ) as unknown as MockedDBservice;
  });
  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
    data = undefined;
    globalThis.localStorage.clear();
    globalThis.sessionStorage.clear();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultStorageService);
  });

  describe('get', () => {
    describe('when storage type is not specified', () => {
      beforeEach(async () => {
        vi.spyOn(globalThis.localStorage.__proto__, 'getItem');
        globalThis.localStorage.setItem('mock', JSON.stringify('default'));
        data = await lastValueFrom(service.get('mock'));
      });

      it('should get data from default local storage', () => {
        expect(data).toBe('default');
        expect(globalThis.localStorage.getItem).toHaveBeenCalledWith('mock');
      });
    });

    describe('when storage type is specified', () => {
      beforeEach(async () => {
        vi.spyOn(globalThis.sessionStorage.__proto__, 'getItem');
        globalThis.sessionStorage.setItem('mock', JSON.stringify('session'));
        data = await lastValueFrom(service.get('mock', StorageType.Session));
      });

      it('should get data from session storage', () => {
        expect(data).toBe('session');
        expect(globalThis.sessionStorage.getItem).toHaveBeenCalledWith('mock');
      });
    });

    describe('when storage type is indexed db', () => {
      beforeEach(async () => {
        await lastValueFrom(service.get('mock', StorageType.Idb));
      });

      it('should get data from indexed db storage', () => {
        expect(dbService.getItem).toHaveBeenCalledWith('mock');
      });
    });

    describe('when stored key is not exist', () => {
      beforeEach(async () => {
        data = await lastValueFrom(service.get('not_exists'));
      });

      it('should return null', () => {
        expect(data).toBe(null);
      });
    });

    describe('when stored value is falsy', () => {
      beforeEach(async () => {
        globalThis.localStorage.setItem('mock', '');
        data = await lastValueFrom(service.get('mock'));
      });

      it('should return null', () => {
        expect(data).toBe(null);
      });
    });
  });

  describe('set', () => {
    describe('when storage type is not specified', () => {
      beforeEach(async () => {
        vi.spyOn(globalThis.localStorage.__proto__, 'setItem');
        data = await lastValueFrom(service.set('mock', 'default'));
      });

      it('should set data in local storage', () => {
        expect(globalThis.localStorage.setItem).toHaveBeenCalledWith(
          'mock',
          JSON.stringify('default')
        );
      });
    });

    describe('when storage type is specified', () => {
      beforeEach(() => {
        vi.spyOn(globalThis.sessionStorage.__proto__, 'setItem');
        service.set('mock', 'session', StorageType.Session);
      });

      it('should set data in session storage', () => {
        expect(globalThis.sessionStorage.setItem).toHaveBeenCalledWith(
          'mock',
          JSON.stringify('session')
        );
      });
    });
  });

  describe('remove', () => {
    describe('when storage type is not specified', () => {
      beforeEach(() => {
        vi.spyOn(globalThis.localStorage.__proto__, 'removeItem');
        service.remove('mock');
      });

      it('should remove data from local storage', () => {
        expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith('mock');
      });
    });

    describe('when storage type is specified', () => {
      beforeEach(() => {
        vi.spyOn(globalThis.sessionStorage.__proto__, 'removeItem');
        service.remove('mock', StorageType.Session);
      });

      it('should remove data from session storage', () => {
        expect(globalThis.sessionStorage.removeItem).toHaveBeenCalledWith(
          'mock'
        );
      });
    });
  });

  describe('clear', () => {
    describe('when storage type is not specified', () => {
      beforeEach(() => {
        vi.spyOn(globalThis.localStorage.__proto__, 'clear');
        service.clear();
      });

      it('should clear local storage', () => {
        expect(globalThis.localStorage.clear).toHaveBeenCalled();
      });
    });

    describe('when storage type is specified', () => {
      beforeEach(() => {
        vi.spyOn(globalThis.sessionStorage.__proto__, 'clear');
        service.clear(StorageType.Session);
      });

      it('should clear session storage', () => {
        expect(globalThis.sessionStorage.clear).toHaveBeenCalled();
      });
    });
  });
});
