import { QueryService } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, of } from 'rxjs';
import { mockStore } from '../../mocks';
import { StoreService } from '../store';
import { CurrencyService } from './currency.service';
import { DefaultCurrencyService } from './default-currency.service';

class MockStoreService implements Partial<StoreService> {
  get = vi.fn().mockReturnValue(of(mockStore));
}

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn().mockReturnValue(of('en-EN'));
}

class MockQueryService implements Partial<QueryService> {
  emit = vi.fn();
}

describe('DefaultCurrencyService', () => {
  let service: CurrencyService;
  let localeService: MockLocaleService;
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
      {
        provide: LocaleService,
        useClass: MockLocaleService,
      },
      { provide: QueryService, useClass: MockQueryService },
    ]);

    service = testInjector.inject(CurrencyService);
    localeService = testInjector.inject<MockLocaleService>(LocaleService);
  });

  afterEach(() => {
    vi.clearAllMocks();
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

  describe('getCurrencySymbol', () => {
    const callback = vi.fn();

    beforeEach(() => {
      service.get = vi.fn().mockReturnValue(of('EUR'));
      service.getCurrencySymbol().subscribe(callback);
    });

    it('should get current currency', () => {
      expect(service.get).toHaveBeenCalled();
    });

    it('should get current locale', () => {
      expect(localeService.get).toHaveBeenCalled();
    });

    it('should format currency symbol', () => {
      expect(callback).toHaveBeenCalledWith('€');
    });
  });
});
