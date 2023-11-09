import { App, InjectionPlugin } from '@spryker-oryx/core';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ProcessSyncsBackgroundSyncTag, SyncExecutorService } from '@spryker-oryx/offline/sync';
import { OfflineServiceWorkerPlugin } from './plugin';

describe('OfflineServiceWorkerPlugin', () => {
  let plugin: OfflineServiceWorkerPlugin;

  beforeEach(() => {
    plugin = new OfflineServiceWorkerPlugin();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getName', () => {
    it('should return proper name', () => {
      expect(plugin.getName()).toBe('oryx.offlineSw');
    });
  });

  describe('apply', () => {
    it('should pass proper flow', () => {
      const mockService = {
        processPendingSyncs: vi.fn().mockReturnValue(of(null)),
      };
      const mockInjector = {
        inject: vi.fn().mockReturnValue(mockService),
      };
      const mockRequire = {
        getInjector: vi.fn().mockReturnValue(mockInjector),
      };
      const mockApp = {
        requirePlugin: vi.fn().mockReturnValue(mockRequire),
      } as unknown as App;
      plugin.apply(mockApp);
      const event = new Event('sync') as Event & {
        tag: string;
        waitUntil: SpyInstance;
      };
      event.tag = ProcessSyncsBackgroundSyncTag;
      event.waitUntil = vi.fn();
      self?.dispatchEvent(event);

      expect(mockApp.requirePlugin).toHaveBeenCalledWith(InjectionPlugin);
      expect(mockRequire.getInjector).toHaveBeenCalled();
      expect(mockInjector.inject).toHaveBeenCalledWith(SyncExecutorService);
      expect(mockService.processPendingSyncs).toHaveBeenCalled();
    });
  });
});
