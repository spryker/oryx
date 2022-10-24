import { SimpleApp } from './app';
import { AppPlugin } from './app.model';

const mockPluginName = 'mockPluginName';
const mockBPluginName = 'mockBPluginName';
const mockDestroy = vi.fn();
const mockBDestroy = vi.fn();

class MockPlugin implements AppPlugin {
  getName(): string {
    return mockPluginName;
  }

  apply(): void {
    //
  }

  destroy(): void {
    mockDestroy();
  }
}

class MockBPlugin implements AppPlugin {
  getName(): string {
    return mockBPluginName;
  }

  apply(): void {
    //
  }

  destroy(): void {
    mockBDestroy();
  }
}

describe('SimpleApp', () => {
  let simpleApp: SimpleApp;

  beforeEach(() => {
    simpleApp = new SimpleApp();
    vi.clearAllMocks();
  });

  describe('findPlugin/registerPlugin', () => {
    it('should be able to register plugin and find it by name', () => {
      simpleApp.registerPlugin(new MockPlugin());
      simpleApp.registerPlugin(new MockBPlugin());
      expect(simpleApp.findPlugin(mockPluginName)).toBeInstanceOf(MockPlugin);
    });

    it('should be able to register plugin and find it by instance', () => {
      simpleApp.registerPlugin(new MockPlugin());
      simpleApp.registerPlugin(new MockBPlugin());
      expect(simpleApp.findPlugin(MockBPlugin)).toBeInstanceOf(MockBPlugin);
    });
  });

  describe('requirePlugin', () => {
    it('should return required plugin', () => {
      simpleApp.registerPlugin(new MockPlugin());
      simpleApp.registerPlugin(new MockBPlugin());
      expect(simpleApp.requirePlugin(MockPlugin)).toBeInstanceOf(MockPlugin);
      expect(simpleApp.requirePlugin(mockBPluginName)).toBeInstanceOf(
        MockBPlugin
      );
    });

    it('should throw an error if required plugin is not registered', () => {
      expect(() => simpleApp.requirePlugin(MockPlugin)).toThrow();
      expect(() => simpleApp.requirePlugin(mockBPluginName)).toThrow();
    });
  });

  describe('whenReady/markReady', () => {
    it('should return promise with instance when application is ready', async () => {
      simpleApp.markReady();
      await expect(simpleApp.whenReady()).resolves.toBeInstanceOf(SimpleApp);
    });
  });

  describe('destroy', () => {
    it('should call destroy method of each plugin', async () => {
      simpleApp.registerPlugin(new MockPlugin());
      simpleApp.registerPlugin(new MockBPlugin());
      simpleApp.destroy();
      expect(mockDestroy).toHaveBeenCalled();
      expect(mockBDestroy).toHaveBeenCalled();
    });
  });
});
