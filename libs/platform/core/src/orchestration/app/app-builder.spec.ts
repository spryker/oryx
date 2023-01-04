import { SpyInstance } from 'vitest';
import { SimpleApp } from './app';
import { SimpleAppBuilder } from './app-builder';
import {
  AppPlugin,
  AppPluginAfterApply,
  AppPluginBeforeApply,
} from './app.model';

const mockPlugin: AppPlugin & AppPluginBeforeApply & AppPluginAfterApply = {
  getName: () => 'getName',
  apply: vi.fn(),
  beforeApply: vi.fn(),
  afterApply: vi.fn(),
  destroy: vi.fn(),
};
const mocApp = {
  registerPlugin: vi.fn(),
  markReady: vi.fn(),
};

vi.mock('./app', () => ({
  SimpleApp: class {
    registerPlugin = (plugin: AppPlugin): void => mocApp.registerPlugin(plugin);
    markReady = (): void => mocApp.markReady();
  },
}));

describe('SimpleAppBuilder', () => {
  let appBuilder: SimpleAppBuilder;

  beforeEach(() => {
    appBuilder = new SimpleAppBuilder();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should return SimpleApp instance', async () => {
      const app = await appBuilder.with(mockPlugin).create();
      expect(app).toBeInstanceOf(SimpleApp);
    });

    it('should register plugin in the SimpleApp instance', async () => {
      await appBuilder.with(mockPlugin).create();
      expect(mocApp.registerPlugin).toHaveBeenCalledWith(mockPlugin);
    });

    it('should call markReady from the SimpleApp instance', async () => {
      await appBuilder.with(mockPlugin).create();
      expect(mocApp.markReady).toHaveBeenCalled();
    });

    it('should call apply method with SimpleApp instance of plugin if method existed', async () => {
      await appBuilder.with(mockPlugin).create();
      (mockPlugin.apply as unknown as SpyInstance).mockImplementation((app) => {
        expect(app).toBeInstanceOf(SimpleApp);
      });
      expect(mockPlugin.apply).toHaveBeenCalled();
    });

    it('should call beforeApply method with SimpleApp instance of plugin if method existed', async () => {
      await appBuilder.with(mockPlugin).create();
      (mockPlugin.beforeApply as unknown as SpyInstance).mockImplementation(
        (app) => {
          expect(app).toBeInstanceOf(SimpleApp);
        }
      );
      expect(mockPlugin.beforeApply).toHaveBeenCalled();
    });

    it('should call afterApply method with SimpleApp instance  of plugin if method existed', async () => {
      await appBuilder.with(mockPlugin).create();
      (mockPlugin.afterApply as unknown as SpyInstance).mockImplementation(
        (app) => {
          expect(app).toBeInstanceOf(SimpleApp);
        }
      );
      expect(mockPlugin.afterApply).toHaveBeenCalled();
    });
  });

  describe('with', () => {
    it('should return instance of itself', () => {
      expect(appBuilder.with(mockPlugin)).toBe(appBuilder);
    });
  });
});
