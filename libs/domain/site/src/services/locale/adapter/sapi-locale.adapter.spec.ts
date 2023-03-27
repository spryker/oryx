import { inject, Injector } from '@spryker-oryx/di';
import { Observable, of, throwError } from 'rxjs';
import { mockStore } from '../../../mocks';
import { StoreService } from '../../store';
import { SapiLocaleAdapter } from './sapi-locale.adapter';

class MockStoreService implements Partial<StoreService> {
  get = vi.fn().mockReturnValue(of(mockStore));
}

describe('SapiLocaleAdapter', () => {
  let adapter: SapiLocaleAdapter;
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = new Injector([
      { provide: SapiLocaleAdapter, useClass: SapiLocaleAdapter },
      { provide: MockStoreService, useClass: MockStoreService },
      { provide: StoreService, useFactory: () => inject(MockStoreService) },
    ]);

    adapter = testInjector.inject(SapiLocaleAdapter);
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(SapiLocaleAdapter);
  });

  describe('getDefault() method', () => {
    it('should return an observable', () => {
      expect(adapter.getDefault()).toBeInstanceOf(Observable);
    });

    it('should return first locale from available locales', () => {
      const cb = vi.fn();

      adapter.getDefault().subscribe(cb);

      expect(cb).toHaveBeenCalledWith(mockStore.locales[0].code);
    });

    describe('when no stores available', () => {
      beforeEach(() => {
        testInjector
          .inject(MockStoreService)
          .get.mockReturnValue(throwError(() => new Error('Mock error')));
      });

      it('should return fallback language', () => {
        const cb = vi.fn();

        adapter.getDefault().subscribe(cb);

        expect(cb).toHaveBeenCalledWith('en');
      });
    });
  });

  describe('getAll() method', () => {
    it('should return an observable', () => {
      expect(adapter.getAll()).toBeInstanceOf(Observable);
    });

    it('should return all available locales', () => {
      const cb = vi.fn();

      adapter.getAll().subscribe(cb);

      expect(cb).toHaveBeenCalledWith(mockStore.locales);
    });

    describe('when no stores available', () => {
      beforeEach(() => {
        testInjector
          .inject(MockStoreService)
          .get.mockReturnValue(throwError(() => new Error('Mock error')));
      });

      it('should return fallback locale', () => {
        const cb = vi.fn();

        adapter.getAll().subscribe(cb);

        expect(cb).toHaveBeenCalledWith([{ name: 'en', code: 'en' }]);
      });
    });
  });
});
