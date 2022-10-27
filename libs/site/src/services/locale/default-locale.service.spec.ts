import { Injector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { mockStore } from '../../mocks';
import { StoreService } from '../store';
import { DefaultLocaleService } from './default-locale.service';
import { LocaleService } from './locale.service';

class MockStoreService implements Partial<StoreService> {
  get = vi.fn().mockReturnValue(of(mockStore));
}

describe('DefaultLocaleService', () => {
  let service: LocaleService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: LocaleService,
        useClass: DefaultLocaleService,
      },
      {
        provide: StoreService,
        useClass: MockStoreService,
      },
    ]);

    service = testInjector.inject(LocaleService);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultLocaleService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
      expect(service.getAll()).toBeInstanceOf(Observable);
    });

    it('should return an observable with current locale', () => {
      const cb = vi.fn();
      service.get().subscribe(cb);
      expect(cb).toHaveBeenCalledWith('de_DE');
    });

    it('should return an observable with all available locales', () => {
      const cb = vi.fn();
      service.getAll().subscribe(cb);
      expect(cb).toHaveBeenCalledWith(mockStore.locales);
    });

    it('should set locale', () => {
      const mock = 'TEST_Locale';
      const cb = vi.fn();

      service.get().subscribe(cb);
      service.set(mock);

      expect(cb).toHaveBeenCalledWith(mock);
    });
  });
});
