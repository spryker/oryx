import { Injector } from '@spryker-oryx/di';
import { Locale } from '../../models';
import {
  DefaultLocaleAdapter,
  DefaultLocaleAdapterConfig,
} from './default-locale.adapter';

describe('DefaultLocaleAdapter', () => {
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = new Injector([
      { provide: DefaultLocaleAdapter, useClass: DefaultLocaleAdapter },
    ]);
  });

  function getAdapter() {
    return testInjector.inject(DefaultLocaleAdapter);
  }

  it('should be provided', () => {
    expect(getAdapter()).toBeInstanceOf(DefaultLocaleAdapter);
  });

  describe('getAll() method', () => {
    describe('without config', () => {
      it('should return empty list of locales', () => {
        const callback = vi.fn();

        getAdapter().getAll().subscribe(callback);

        expect(callback).toHaveBeenCalledWith([]);
      });
    });

    describe('with locales config', () => {
      const mockLocales: Locale[] = [{ name: 'mock', code: 'mock' }];

      beforeEach(() => {
        testInjector.provide({
          provide: DefaultLocaleAdapterConfig,
          useValue: { locales: mockLocales } as DefaultLocaleAdapterConfig,
        });
      });

      it('should return locales from config', () => {
        const callback = vi.fn();

        getAdapter().getAll().subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockLocales);
      });
    });
  });

  describe('getDefault() method', () => {
    describe('without config', () => {
      it('should return navigator.language value', () => {
        const callback = vi.fn();
        vi.spyOn(navigator, 'language', 'get').mockReturnValue('mock-locale');

        getAdapter().getDefault().subscribe(callback);

        expect(callback).toHaveBeenCalledWith('mock-locale');
      });
    });

    describe('with defaultLocale config', () => {
      beforeEach(() => {
        testInjector.provide({
          provide: DefaultLocaleAdapterConfig,
          useValue: {
            defaultLocale: 'mock-locale',
          } as DefaultLocaleAdapterConfig,
        });
      });

      it('should return defaultLocale from config', () => {
        const callback = vi.fn();

        getAdapter().getDefault().subscribe(callback);

        expect(callback).toHaveBeenCalledWith('mock-locale');
      });
    });

    describe('with only locales config', () => {
      const mockLocales: Locale[] = [{ name: 'mock', code: 'mock' }];

      beforeEach(() => {
        testInjector.provide({
          provide: DefaultLocaleAdapterConfig,
          useValue: { locales: mockLocales } as DefaultLocaleAdapterConfig,
        });
      });

      it('should return first locale of locales from config', () => {
        const callback = vi.fn();

        getAdapter().getDefault().subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockLocales[0].code);
      });
    });
  });
});
