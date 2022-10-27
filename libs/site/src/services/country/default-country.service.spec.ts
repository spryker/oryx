import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { mockStore } from '../../mocks';
import { StoreService } from '../store';
import { CountryService } from './country.service';
import { DefaultCountryService } from './default-country.service';

class MockStoreService implements Partial<StoreService> {
  get = vi.fn().mockReturnValue(of(mockStore));
}

const callback = vi.fn();

describe('DefaultCountryService', () => {
  let service: CountryService;
  let storeService: MockStoreService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CountryService,
          useClass: DefaultCountryService,
        },
        {
          provide: StoreService,
          useClass: MockStoreService,
        },
      ],
    });

    service = testInjector.inject(CountryService);
    storeService = testInjector.inject(
      StoreService
    ) as unknown as MockStoreService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCountryService);
  });

  describe('getAll', () => {
    it('should return an observable', () => {
      expect(service.getAll()).toBeInstanceOf(Observable);
    });

    it('should get countries', () => {
      service.getAll().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockStore.countries);
      expect(storeService.get).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should get current country', () => {
      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(null);
    });

    it('should set current country', () => {
      const mock = 'US';

      service.get().subscribe(callback);
      service.set(mock);

      expect(callback).toHaveBeenCalledWith(mockStore.countries[1]);
    });
  });
});
