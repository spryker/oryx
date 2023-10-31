import {
  DefaultIndexedDBStorageService,
  indexedDbStorageName,
  IndexedDBStorageService,
  indexedDbTableName,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { firstValueFrom } from 'rxjs';

const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
};

const mockDB = {
  transaction: vi.fn(),
};

const mockOpenRequest = {
  onerror: null,
  onsuccess: null,
  onupgradeneeded: null,
  result: mockDB,
};

const mockTransaction = {
  objectStore: vi.fn(),
};

const mockObjectStore = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
};

const mockRequest = {
  onerror: null,
  onsuccess: null,
  result: null,
};

global.indexedDB = mockIndexedDB as any;
mockIndexedDB.open.mockReturnValue(mockOpenRequest);
mockDB.transaction.mockReturnValue(mockTransaction);
mockTransaction.objectStore.mockReturnValue(mockObjectStore);

function mockSuccessfulRequest(request: any, result: any) {
  request.onsuccess = null;
  request.result = result;
  setTimeout(() => request.onsuccess?.({ target: request }), 0);
}

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

    mockSuccessfulRequest(mockIndexedDB.open(indexedDbStorageName), mockDB);
    mockSuccessfulRequest(
      mockDB.transaction(indexedDbTableName),
      mockTransaction
    );
    mockSuccessfulRequest(
      mockTransaction.objectStore(indexedDbTableName),
      mockObjectStore
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('getItem', () => {
    it('should get the value from db', () => {
      const expectedValue = 'value';
      mockObjectStore.get.mockReturnValue({
        ...mockRequest,
        result: { key: 'mockedKey', value: expectedValue },
      });

      mockSuccessfulRequest(mockObjectStore.get('mockedKey'), {
        key: 'mockedKey',
        value: expectedValue,
      });

      return firstValueFrom(service.getItem('mockedKey')).then((value) => {
        expect(value).toBe(expectedValue);
      });
    });
  });

  describe('setItem', () => {
    it('should store the value to the db', () => {
      mockObjectStore.put.mockReturnValue(mockRequest);

      mockSuccessfulRequest(
        mockObjectStore.put({ key: 'mockedKey', value: 'mockedValue' }),
        undefined
      );

      return firstValueFrom(service.setItem('mockedKey', 'mockedValue')).then(
        () => {
          expect(mockObjectStore.put).toHaveBeenCalledWith({
            key: 'mockedKey',
            value: 'mockedValue',
          });
        }
      );
    });
  });

  describe('removeItem', () => {
    it('should remove the item', () => {
      mockObjectStore.delete.mockReturnValue(mockRequest);

      mockSuccessfulRequest(mockObjectStore.delete('mockedKey'), undefined);

      return firstValueFrom(service.removeItem('mockedKey')).then(() => {
        expect(mockObjectStore.delete).toHaveBeenCalledWith('mockedKey');
      });
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      mockObjectStore.clear.mockReturnValue(mockRequest);

      mockSuccessfulRequest(mockObjectStore.clear(), undefined);

      return firstValueFrom(service.clear()).then(() => {
        expect(mockObjectStore.clear).toHaveBeenCalled();
      });
    });
  });
});
