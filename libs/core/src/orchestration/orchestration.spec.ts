import { AppPlugin, AppPluginAfterApply, AppPluginBeforeApply } from './app';
import { ComponentsInfo, ComponentsPlugin } from './components';
import { InjectionPlugin } from './injection';
import { app } from './orchestration';

const mockApplyPlugin: AppPlugin & AppPluginBeforeApply & AppPluginAfterApply =
  {
    getName: () => 'getName',
    apply: vi.fn(),
    beforeApply: vi.fn(),
    afterApply: vi.fn(),
  };

const mockApply = vi.fn();

vi.mock('./components', () => ({
  ComponentsPlugin: vi.fn().mockReturnValue({
    apply: () => mockApply(),
  }),
}));

vi.mock('./injection', () => ({
  InjectionPlugin: vi.fn().mockReturnValue({
    apply: () => mockApply(),
  }),
}));

const mockOptions = {
  injector: {
    context: 'context',
  },
  components: {
    preload: true,
  },
};

describe('app', () => {
  describe('create', () => {
    it('should call apply method of plugin if method existed', async () => {
      await app().with(mockApplyPlugin).create();
      expect(mockApplyPlugin.apply).toHaveBeenCalled();
    });

    it('should call beforeApply method of plugin if method existed', async () => {
      await app().with(mockApplyPlugin).create();
      expect(mockApplyPlugin.beforeApply).toHaveBeenCalled();
    });

    it('should call afterApply method of plugin if method existed', async () => {
      await app().with(mockApplyPlugin).create();
      expect(mockApplyPlugin.afterApply).toHaveBeenCalled();
    });
  });

  describe('with', () => {
    it('should return instance of itself', () => {
      const application = app();
      expect(application.with(mockApplyPlugin)).toBe(application);
    });
  });

  describe('withOptions', () => {
    it('should return instance of itself', () => {
      const application = app();
      expect(application.withOptions(mockOptions)).toBe(application);
    });
  });

  describe('withProviders', () => {
    const mockProviders = [{ provide: 'provide', useValue: 'useValue' }];

    it('should return instance of itself', () => {
      const application = app();
      expect(application.withProviders(mockProviders)).toBe(application);
    });

    it('should add providers and pass them to the InjectionPlugin with options', async () => {
      await app()
        .withProviders(mockProviders)
        .withOptions(mockOptions)
        .create();
      expect(InjectionPlugin).toHaveBeenCalledWith(
        mockProviders,
        mockOptions.injector
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });

  describe('withComponents', () => {
    const mockComponents = ['mockComponents'] as unknown as ComponentsInfo;

    it('should return instance of itself', () => {
      const application = app();
      expect(application.withComponents(mockComponents)).toBe(application);
    });

    it('should add components and pass them to the ComponentsPlugin with options', async () => {
      await app()
        .withComponents(mockComponents)
        .withOptions(mockOptions)
        .create();
      expect(ComponentsPlugin).toHaveBeenCalledWith(
        mockComponents,
        mockOptions.components
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });
});
