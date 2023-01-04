import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { StoreAdapter } from '../adapter';
import { DefaultStoreService } from './default-store.service';
import { StoreService } from './store.service';

const mockStores = [{ id: 'DE', countries: [], locales: [], currencies: [] }];

class MockStoreAdapter implements Partial<StoreAdapter> {
  get = vi.fn().mockReturnValue(of(mockStores));
}

describe('DefaultStoreService', () => {
  let service: DefaultStoreService;
  let adapter: MockStoreAdapter;
  const callback = vi.fn();

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: StoreService,
          useClass: DefaultStoreService,
        },
        {
          provide: StoreAdapter,
          useClass: MockStoreAdapter,
        },
        {
          provide: 'STORE',
          useValue: 'DE',
        },
      ],
    });

    service = testInjector.inject(StoreService) as DefaultStoreService;
    adapter = testInjector.inject(StoreAdapter) as MockStoreAdapter;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultStoreService);
  });

  describe('getAll stores', () => {
    it('should retrieve stores', () => {
      service.getAll().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockStores);
    });
    it('should call adapter', () => {
      service.getAll().subscribe();
      expect(adapter.get).toHaveBeenCalled();
    });
  });

  describe('get active store', () => {
    it('should retrieve current store', () => {
      service.get().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockStores[0]);
    });
  });
});
