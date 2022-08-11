import { Injector } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { DefaultLocaleService } from './default-locale.service';
import { LocaleService } from './locale.service';

describe('DefaultLocaleService', () => {
  let service: LocaleService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: LocaleService,
        useClass: DefaultLocaleService,
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
      expect(cb).toHaveBeenCalledWith('de-DE');
    });

    it('should return an observable with all available locales', () => {
      const cb = vi.fn();
      service.getAll().subscribe(cb);
      expect(cb).toHaveBeenCalledWith(['de-DE', 'en-US']);
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
