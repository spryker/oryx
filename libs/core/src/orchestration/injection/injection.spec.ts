import { SpyInstance } from 'vitest';
import { App, AppRef } from '../app';
import { InjectionPlugin, InjectionPluginName } from './injection';

const mockProviders = [
  {
    provide: 'A',
    useValue: 'value A',
  },
  {
    provide: 'B',
    useValue: 'value B',
  },
];
const mockOptions = {
  context: 'context',
};
const mockCreateInjector = vi.fn();

vi.mock('@spryker-oryx/injector', () => ({
  createInjector: (value: unknown): SpyInstance => mockCreateInjector(value),
}));

describe('InjectionPlugin', () => {
  let plugin: InjectionPlugin;

  beforeEach(() => {
    plugin = new InjectionPlugin(mockProviders, mockOptions);
    vi.resetAllMocks();
  });

  describe('getName', () => {
    it('should return proper name', () => {
      expect(plugin.getName()).toBe(InjectionPluginName);
    });
  });

  describe('beforeApply', () => {
    it('should createInjector', () => {
      const mockApp = 'mockApp' as unknown as App;
      plugin.beforeApply(mockApp);
      expect(mockCreateInjector).toHaveBeenCalledWith({
        ...mockOptions,
        providers: [...mockProviders, { provide: AppRef, useValue: mockApp }],
      });
    });
  });

  describe('getInjector', () => {
    it('should return injector', () => {
      const mockInjector = 'mockInjector';
      mockCreateInjector.mockReturnValue(mockInjector);
      plugin.beforeApply('mockApp' as unknown as App);
      expect(plugin.getInjector()).toBe(mockInjector);
    });
  });

  describe('provide', () => {
    it('should call provide method from injector', () => {
      const mockInjector = { provide: vi.fn() };
      mockCreateInjector.mockReturnValue(mockInjector);
      plugin.beforeApply('mockApp' as unknown as App);
      plugin.provide(mockProviders[0]);
      expect(mockInjector.provide).toHaveBeenCalledWith(mockProviders[0]);
    });
  });
});
