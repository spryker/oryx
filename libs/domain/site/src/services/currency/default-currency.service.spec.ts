import { Injector } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { mockStore } from '../../mocks';
import { StoreService } from '../store';
import { CurrencyService } from './currency.service';
import { DefaultCurrencyService } from './default-currency.service';

class MockStoreService implements Partial<StoreService> {
  get = vi.fn().mockReturnValue(of(mockStore));
}

describe('DefaultCurrencyService', () => {
  let service: CurrencyService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: CurrencyService,
        useClass: DefaultCurrencyService,
      },
      {
        provide: StoreService,
        useClass: MockStoreService,
      },
    ]);

    service = testInjector.inject(CurrencyService);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCurrencyService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
      expect(service.getAll()).toBeInstanceOf(Observable);
    });

    it('should return an observable with current currency', () => {
      const cb = vi.fn();
      service.get().subscribe(cb);
      expect(cb).toHaveBeenCalledWith('EUR');
    });

    it('should return an observable with all available currencies', () => {
      const cb = vi.fn();
      service.getAll().subscribe(cb);
      expect(cb).toHaveBeenCalledWith(mockStore.currencies);
    });

    it('should set currency', () => {
      const mock = 'TEST_CURRENCY';
      const cb = vi.fn();

      service.get().subscribe(cb);
      service.set(mock);

      expect(cb).toHaveBeenCalledWith(mock);
    });
  });
});
