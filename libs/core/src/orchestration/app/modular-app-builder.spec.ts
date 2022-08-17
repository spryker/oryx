import { ComponentsInfo, ComponentsPlugin } from '../components';
import { InjectionPlugin } from '../injection';
import { ModularAppBuilder } from './modular-app-builder';

const mockApply = vi.fn();

vi.mock('../components', () => ({
  ComponentsPlugin: vi.fn().mockReturnValue({
    apply: () => mockApply(),
  }),
}));

vi.mock('../injection', () => ({
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

describe('ModularAppBuilder', () => {
  let modularAppBuilder: ModularAppBuilder;

  beforeEach(() => {
    modularAppBuilder = new ModularAppBuilder();
    vi.clearAllMocks();
  });

  describe('withOptions', () => {
    it('should return instance of itself', () => {
      expect(modularAppBuilder.withOptions(mockOptions)).toBe(
        modularAppBuilder
      );
    });
  });

  describe('withProviders', () => {
    const mockProviders = [{ provide: 'provide', useValue: 'useValue' }];

    it('should return instance of itself', () => {
      expect(modularAppBuilder.withProviders(mockProviders)).toBe(
        modularAppBuilder
      );
    });

    it('should add providers and pass them to the InjectionPlugin with options', async () => {
      await modularAppBuilder
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
      expect(modularAppBuilder.withComponents(mockComponents)).toBe(
        modularAppBuilder
      );
    });

    it('should add components and pass them to the ComponentsPlugin with options', async () => {
      await modularAppBuilder
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

  describe('withFeature', () => {
    const mockComponents = ['mockComponents'] as unknown as ComponentsInfo;
    const mockProviders = [{ provide: 'provide', useValue: 'useValue' }];

    it('should return instance of itself', () => {
      expect(
        modularAppBuilder.withFeature({
          providers: mockProviders,
          components: mockComponents,
        })
      ).toBe(modularAppBuilder);
    });

    it('should pass components and injectors into appropriate plugins with options', async () => {
      await modularAppBuilder
        .withFeature({
          providers: mockProviders,
          components: mockComponents,
        })
        .withOptions(mockOptions)
        .create();
      expect(ComponentsPlugin).toHaveBeenCalledWith(
        mockComponents,
        mockOptions.components
      );
      expect(InjectionPlugin).toHaveBeenCalledWith(
        mockProviders,
        mockOptions.injector
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });
});
