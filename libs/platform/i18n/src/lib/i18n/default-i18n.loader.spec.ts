import {
  DefaultI18nLoader,
  DefaultI18nLoaderConfig,
} from './default-i18n.loader';
import { GlobalizeService } from './globalize.service';

describe('DefaultI18nLoader', () => {
  class MockGlobalizeService {
    resolveLocales = vi.fn();
    asReal(): GlobalizeService {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function setup(options?: {
    loaderConfig?: Partial<DefaultI18nLoaderConfig>;
  }) {
    const loadSpy = vi.fn().mockResolvedValue({});
    const loaderConfig = { load: loadSpy, ...options?.loaderConfig };
    const globalizeService = new MockGlobalizeService();
    const i18nLoader = new DefaultI18nLoader(
      loaderConfig,
      globalizeService.asReal()
    );

    return { i18nLoader, globalizeService, loadSpy };
  }

  describe('load() method', () => {
    it('should call `GlobalizeService.resolveLocales()` to resolve locales and load them', async () => {
      const { i18nLoader, globalizeService, loadSpy } = setup();
      globalizeService.resolveLocales.mockReturnValue(
        Promise.resolve(['mock-locale-1', 'mock-locale-2'])
      );

      await i18nLoader.load('locale-id');

      expect(globalizeService.resolveLocales).toHaveBeenCalledWith('locale-id');
      expect(loadSpy).toHaveBeenCalledWith('mock-locale-1');
      expect(loadSpy).toHaveBeenCalledWith('mock-locale-2');
    });

    it('should return loaded locale data bundle', async () => {
      const { i18nLoader, globalizeService, loadSpy } = setup();
      globalizeService.resolveLocales.mockReturnValue(
        Promise.resolve(['mock-locale-1', 'mock-locale-2'])
      );
      loadSpy.mockImplementation((localeId) =>
        Promise.resolve({ default: { mockDataFor: localeId } })
      );

      const res = i18nLoader.load('locale-id');

      await expect(res).resolves.toEqual({
        'mock-locale-1': { mockDataFor: 'mock-locale-1' },
        'mock-locale-2': { mockDataFor: 'mock-locale-2' },
      });
    });

    it('should return empty data bundle without load config', async () => {
      const { i18nLoader, globalizeService } = setup({
        loaderConfig: { load: undefined },
      });
      globalizeService.resolveLocales.mockReturnValue(
        Promise.resolve(['mock-locale-1', 'mock-locale-2'])
      );

      const res = i18nLoader.load('locale-id');

      await expect(res).resolves.toEqual({
        'mock-locale-1': {},
        'mock-locale-2': {},
      });
    });

    it('should return empty data bundle when loading failed', async () => {
      const { i18nLoader, globalizeService, loadSpy } = setup();
      globalizeService.resolveLocales.mockReturnValue(
        Promise.resolve(['mock-locale-1', 'mock-locale-2', 'mock-locale-3'])
      );
      loadSpy.mockImplementation((localeId) =>
        localeId === 'mock-locale-2'
          ? Promise.reject(new Error('Mock Error'))
          : Promise.resolve({ default: { mockDataFor: true } })
      );

      const res = i18nLoader.load('locale-id');

      await expect(res).resolves.toEqual({
        'mock-locale-1': { mockDataFor: true },
        'mock-locale-2': {},
        'mock-locale-3': { mockDataFor: true },
      });
    });

    it('should cache data bundles by default', async () => {
      const { i18nLoader, globalizeService, loadSpy } = setup();
      globalizeService.resolveLocales.mockReturnValue(
        Promise.resolve(['mock-locale-1', 'mock-locale-2'])
      );

      await i18nLoader.load('locale-id');

      // Called 2 times, once per each resolved locale
      expect(loadSpy).toHaveBeenCalledTimes(2);

      await i18nLoader.load('locale-id');

      // Still called 2 times for the same localeId
      expect(loadSpy).toHaveBeenCalledTimes(2);

      await i18nLoader.load('new-locale-id');

      // Called 4 times for the new localeId
      expect(loadSpy).toHaveBeenCalledTimes(4);
    });

    it('should disable cache when `skipCache=true` config used', async () => {
      const { i18nLoader, globalizeService, loadSpy } = setup({
        loaderConfig: { skipCache: true },
      });
      globalizeService.resolveLocales.mockReturnValue(
        Promise.resolve(['mock-locale-1', 'mock-locale-2'])
      );

      await i18nLoader.load('locale-id');

      // Called 2 times, once per each resolved locale
      expect(loadSpy).toHaveBeenCalledTimes(2);

      await i18nLoader.load('locale-id');

      // Called 4 times even for same locale
      expect(loadSpy).toHaveBeenCalledTimes(4);
    });
  });
});
